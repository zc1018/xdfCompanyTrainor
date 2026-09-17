# Enterprise learning hero · image2 + Atlas Cloud MiniMax H3

The approved concept is a calm “learn → practice → apply” scene. Only one H3 video
task is authorized for this run. Do not rerun the generator to improve a result or
recover an uncertain submission: use the saved prediction ID.

- First/end frame: `first-frame.png`, generated with the built-in image2 tool.
  Requested 16:9; actual output 1672×941. The text is generated in the image itself.
- Full image prompt: `first-frame-prompt.txt`.
- Video motion prompt: `video-prompt.txt`.
- Provider/model: Atlas Cloud `minimax/h3/image-to-video`, 2K, 12 seconds,
  adaptive ratio, same first/end image, prompt expansion disabled.
- Quoted cost: USD 1.56, recorded in `quote.json`. This is the API quote, not an
  independently verified account billing statement.
- Exactly one submitted prediction: `827489a725524bcb89cf3ddc1ff45a6c`.
- `submission.json` and `status.json` record provider state; no credentials are
  included. The runner reads the API key with terminal echo disabled, keeps it in
  memory, and only transmits it to `api.atlascloud.ai` for this workflow.

Current state: generation completed successfully. `output.json` records the
returned URL; `raw.mp4` preserves the provider output (2560×1440, 24 fps,
12.25 seconds, 1,526,505 bytes). The website uses the optimized 1080p copy at
`../../assets/media/enterprise-learning-h3.mp4` and its first-frame JPEG.

Media verification:

- Full raw decode: no reported errors.
- Sampled six frames: notebook underline, practice waveform, meeting expression,
  and reset state retain the intended English and fixed scene.
- First/last web frame SSIM: 0.996038. The original generated loop is retained;
  no reverse playback, added text, or transition has been applied.
- Web file: 12.25 seconds, 1920×1080, 24 fps, H.264/yuv420p, no audio,
  fast-start, 1,187,413 bytes. See `../../assets/media/SOURCES.md` for hashes.
- `contact-sheet.jpg` and `last-frame.jpg` are local visual-QA samples.

Webpage verification: build passed; 107 automated checks passed, zero failed.
The checks cover eight widths (320, 390, 640, 641, 768, 1024, 1440, 1932),
full-frame media display, same-origin playback with all external origins blocked,
pause/reduced motion, loading/error posters, and existing consultation flows.
Results are saved as `web-qa.json`. Desktop/mobile screenshots were reviewed;
real-device iPhone/Android testing and the user's subjective playback review are
not claimed.

Only `feat/enterprise-motion-home` and the local preview are changed. No remote
push or production deployment has been performed; the original video is retained.

Primary provider documentation:

- https://www.atlascloud.ai/models/minimax/h3/image-to-video
- https://static.atlascloud.ai/model/schema/minimax-h3-image-to-video.json
- https://static.atlascloud.ai/model/readme/minimax-h3-image-to-video.md
