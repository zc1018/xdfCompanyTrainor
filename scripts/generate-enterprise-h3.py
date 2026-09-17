"""Submit exactly one approved Atlas Cloud H3 video; never retry a paid POST.

The credential stays in process memory, entered with terminal echo disabled.
Run with --resume to poll a saved successful submission without generating again.
"""
import argparse
import base64
import getpass
import hashlib
import json
from pathlib import Path
import subprocess
import tempfile
import time

ROOT = Path(__file__).resolve().parents[1] / 'production/enterprise-h3-20260917'
API = 'https://api.atlascloud.ai/api/v1/model/'
MAX_PRICE_USD = 1.56


def save(name, data):
    destination = ROOT / name
    temporary = destination.with_suffix(destination.suffix + '.tmp')
    temporary.write_text(json.dumps(data, ensure_ascii=False, indent=2) + '\n')
    temporary.replace(destination)


def api(endpoint, key, payload=None, timeout=45):
    # A private curl config on stdin keeps credentials out of process arguments.
    config = f'url = "{API}{endpoint}"\nheader = "Authorization: Bearer {key}"\nheader = "Content-Type: application/json"\n'
    args = ['curl', '--config', '-', '--silent', '--show-error', '--max-time', str(timeout), '--write-out', '\nHTTP_STATUS:%{http_code}']
    with tempfile.NamedTemporaryFile(mode='w+', suffix='.json') as request_file:
        if payload is not None:
            json.dump(payload, request_file, ensure_ascii=False)
            request_file.flush()
            args += ['--request', 'POST', '--data-binary', '@' + request_file.name]
        result = subprocess.run(args, input=config, text=True, capture_output=True)
    body, separator, status = result.stdout.replace(key, '[REDACTED]').rpartition('\nHTTP_STATUS:')
    if result.returncode or not separator:
        raise RuntimeError(f'Uncertain network result (curl {result.returncode}); do not repeat a paid submission.')
    try:
        data = json.loads(body)
    except ValueError:
        raise RuntimeError('Non-JSON response; do not repeat a paid submission.') from None
    if status != '200' or data.get('code', 200) not in [0, 200, '0', '200']:
        raise RuntimeError('Atlas API error: ' + json.dumps(data, ensure_ascii=False)[:1200])
    return data


def unwrap(data):
    return data.get('data', data)


def main():
    parser = argparse.ArgumentParser()
    parser.add_argument('--resume', action='store_true')
    args = parser.parse_args()
    receipt_path = ROOT / 'submission.json'
    if receipt_path.exists() and not args.resume:
        raise SystemExit('Submission record exists. Only --resume is allowed; no new paid request.')
    if args.resume and not receipt_path.exists():
        raise SystemExit('No existing receipt to resume.')
    key = getpass.getpass('Atlas Cloud API key (hidden; not saved): ').strip()
    if not key or any(character in key for character in '\n\r"'):
        raise SystemExit('Missing or invalid credential.')
    if args.resume:
        receipt = json.loads(receipt_path.read_text())
        identifier = unwrap(receipt).get('id')
        if not identifier:
            raise SystemExit('Existing submission has no known ID. Inspect provider history; never resubmit blindly.')
    else:
        image_bytes = (ROOT / 'first-frame.png').read_bytes()
        image = 'data:image/png;base64,' + base64.b64encode(image_bytes).decode()
        payload = {
            'model': 'minimax/h3/image-to-video',
            'prompt': (ROOT / 'video-prompt.txt').read_text(),
            'image': image, 'end_image': image,
            'resolution': '2K', 'duration': 12,
            'ratio': 'adaptive', 'prompt_expansion': False,
        }
        request_record = {**payload, 'image': 'first-frame.png', 'end_image': 'first-frame.png', 'image_sha256': hashlib.sha256(image_bytes).hexdigest()}
        save('request.json', request_record)
        quote = api('calculate', key, payload)
        save('quote.json', quote)
        price = float(unwrap(quote)['price'])
        if price > MAX_PRICE_USD:
            raise SystemExit(f'Quote ${price} exceeds ${MAX_PRICE_USD}; no task submitted.')
        save('submission.json', {'state': 'submitting', 'model': payload['model'], 'quoted_usd': price, 'submitted_at': time.time()})
        receipt = api('generateVideo', key, payload, timeout=120)
        save('submission.json', receipt)
        identifier = unwrap(receipt).get('id')
        if not identifier:
            raise RuntimeError('No prediction ID. Submission record saved; do not submit again.')
        print(json.dumps({'submitted': True, 'id': identifier, 'quoted_usd': price}), flush=True)

    started = time.monotonic()
    failures = 0
    while time.monotonic() - started < 2400:
        try:
            response = api('prediction/' + identifier, key)
            failures = 0
        except RuntimeError:
            failures += 1
            if failures >= 3:
                raise RuntimeError('Status retrieval failed 3 times. Resume the saved ID; no new paid request.') from None
            print(json.dumps({'id': identifier, 'status_read_retry': failures}), flush=True)
            time.sleep(25)
            continue
        save('status.json', response)
        data = unwrap(response)
        status = str(data.get('status', '')).lower()
        print(json.dumps({'id': identifier, 'status': status, 'elapsed_seconds': round(time.monotonic() - started)}), flush=True)
        if status in ['completed', 'succeeded']:
            outputs = data.get('outputs') or []
            if len(outputs) != 1:
                raise RuntimeError('Expected exactly one output. Inspect saved status before downloading.')
            save('output.json', {'id': identifier, 'url': outputs[0]})
            print('Video ready; download and visual QA remain.', flush=True)
            return
        if status in ['failed', 'canceled', 'cancelled']:
            raise RuntimeError('Video task failed. Saved provider response; no paid retry.')
        time.sleep(25)
    raise RuntimeError('Polling timed out. Resume this ID, never regenerate.')


if __name__ == '__main__':
    main()
