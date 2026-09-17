import { useEffect, useRef, useState } from 'react';
import localVideo from '../../assets/media/enterprise-scroll.mp4';
import poster from '../../assets/media/enterprise-scroll-poster.jpg';

export const SCROLL_VIDEO_URL = 'https://d8j0ntlcm91z4.cloudfront.net/user_38xzZboKViGWJOttwIXH07lWA1P/hf_20260729_102822_0e6c87e8-c141-4744-bf32-ad30db296371.mp4';
const localHost = ['localhost', '127.0.0.1', '[::1]'].includes(location.hostname);
const clamp = (value: number) => Math.min(1, Math.max(0, value));

function wait(ms: number, signal: AbortSignal) {
  return new Promise<void>((resolve, reject) => {
    const abort = () => { clearTimeout(timer); reject(new DOMException('Aborted', 'AbortError')); };
    const timer = setTimeout(() => { signal.removeEventListener('abort', abort); resolve(); }, ms);
    signal.addEventListener('abort', abort, { once: true });
    if (signal.aborted) abort();
  });
}

function mediaEvent(video: HTMLVideoElement, event: string, signal: AbortSignal) {
  return new Promise<void>((resolve, reject) => {
    const cleanup = () => { clearTimeout(timer); video.removeEventListener(event, done); video.removeEventListener('error', fail); signal.removeEventListener('abort', fail); };
    const done = () => { cleanup(); resolve(); };
    const fail = () => { cleanup(); reject(new Error('Media unavailable')); };
    const timer = setTimeout(fail, 15000);
    video.addEventListener(event, done, { once: true });
    video.addEventListener('error', fail, { once: true });
    signal.addEventListener('abort', fail, { once: true });
    if (signal.aborted) fail();
  });
}

interface Props { reduced: boolean; paused: boolean }
export default function ScrollVideo({ reduced, paused }: Props) {
  const rootRef = useRef<HTMLDivElement>(null);
  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const frozen = useRef(paused);
  const wake = useRef(() => {});
  const [source, setSource] = useState(localHost ? localVideo : SCROLL_VIDEO_URL);
  const [phase, setPhase] = useState<'poster' | 'video' | 'cache'>('poster');

  useEffect(() => { frozen.current = paused; wake.current(); }, [paused]);

  useEffect(() => {
    const video = videoRef.current!;
    const canvas = canvasRef.current!;
    const root = rootRef.current!;
    const controller = new AbortController();
    const { signal } = controller;
    const frames: ImageBitmap[] = [];
    let extractor: HTMLVideoElement | undefined;
    let cacheReady = false;
    let extracting = false;
    let raf = 0;
    let lastFrame = -1;
    let smoothed = 0;
    let target = 0;
    let width = innerWidth;
    let height = innerHeight;
    let dpr = Math.min(devicePixelRatio || 1, 2);
    const context = canvas.getContext('2d', { alpha: false });
    setPhase('poster');

    const progress = () => clamp(scrollY / Math.max(1, document.documentElement.scrollHeight - innerHeight));
    const draw = () => {
      if (!cacheReady || !context) return;
      const index = Math.round(smoothed * (frames.length - 1));
      if (index === lastFrame) return;
      const frame = frames[index];
      const scale = Math.max(width / frame.width, height / frame.height);
      const w = frame.width * scale;
      const h = frame.height * scale;
      context.setTransform(dpr, 0, 0, dpr, 0, 0);
      context.drawImage(frame, (width - w) / 2, (height - h) / 2, w, h);
      lastFrame = index;
    };
    const tick = () => {
      raf = 0;
      if (signal.aborted || reduced || frozen.current || document.hidden) return;
      smoothed += (target - smoothed) * 0.12;
      if (Math.abs(target - smoothed) < 0.0001) smoothed = target;
      root.dataset.progress = smoothed.toFixed(4);
      if (cacheReady) draw();
      else if (video.readyState >= 2 && Number.isFinite(video.duration) && !video.seeking) {
        const time = smoothed * Math.max(0, video.duration - 0.05);
        if (Math.abs(video.currentTime - time) > 0.04) video.currentTime = time;
      }
      if (smoothed !== target) raf = requestAnimationFrame(tick);
    };
    const schedule = () => { if (!raf && !signal.aborted) raf = requestAnimationFrame(tick); };
    const scroll = () => { target = progress(); schedule(); };
    const resize = () => {
      width = innerWidth; height = innerHeight; dpr = Math.min(devicePixelRatio || 1, 2);
      canvas.width = Math.round(width * dpr); canvas.height = Math.round(height * dpr);
      lastFrame = -1; scroll();
    };
    const fail = () => {
      if (source !== localVideo) setSource(localVideo);
      else setPhase('poster');
    };
    const buildCache = async () => {
      if (extracting || !context || !('createImageBitmap' in window) || reduced) return;
      extracting = true;
      try {
        await wait(300, signal);
        extractor = document.createElement('video');
        extractor.crossOrigin = 'anonymous'; extractor.muted = true; extractor.playsInline = true; extractor.preload = 'auto';
        const loaded = mediaEvent(extractor, 'loadeddata', signal);
        extractor.src = source; extractor.load();
        await loaded;
        const smallDevice = matchMedia('(max-width: 767px)').matches || ((navigator as Navigator & { deviceMemory?: number }).deviceMemory ?? 8) <= 4;
        const count = Math.min(smallDevice ? 48 : 90, Math.max(24, Math.ceil(extractor.duration * 12)));
        const surface = document.createElement('canvas');
        surface.width = Math.min(smallDevice ? 640 : 960, extractor.videoWidth);
        surface.height = Math.round(surface.width * extractor.videoHeight / extractor.videoWidth);
        const painter = surface.getContext('2d', { alpha: false });
        if (!painter) return;
        for (let i = 0; i < count; i++) {
          while (document.hidden || frozen.current) await wait(200, signal);
          if (signal.aborted) return;
          const time = i / (count - 1) * (extractor.duration - 0.05);
          if (Math.abs(extractor.currentTime - time) > 0.001) {
            const sought = mediaEvent(extractor, 'seeked', signal);
            extractor.currentTime = time;
            await sought;
          }
          painter.drawImage(extractor, 0, 0, surface.width, surface.height);
          const bitmap = await createImageBitmap(surface);
          if (signal.aborted) { bitmap.close(); return; }
          frames.push(bitmap);
          await wait(16, signal);
        }
        cacheReady = true; lastFrame = -1;
        root.dataset.frames = String(frames.length);
        draw(); setPhase('cache'); schedule();
      } catch {
        // Seeking stays available when decoding, CORS, or memory limits prevent caching.
        for (const frame of frames) frame.close();
        frames.length = 0;
      } finally {
        if (extractor) { extractor.removeAttribute('src'); extractor.load(); }
      }
    };
    const loaded = () => { if (!signal.aborted) { setPhase('video'); scroll(); void buildCache(); } };
    wake.current = schedule;
    resize(); smoothed = target;
    const loadTimeout = source === localVideo ? undefined : setTimeout(() => { if (video.readyState < 2) fail(); }, 8000);
    window.addEventListener('scroll', scroll, { passive: true });
    window.addEventListener('resize', resize);
    document.addEventListener('visibilitychange', schedule);
    const layoutObserver = new ResizeObserver(scroll);
    layoutObserver.observe(document.getElementById('main') ?? document.body);
    video.addEventListener('loadeddata', loaded);
    video.addEventListener('seeked', schedule);
    video.addEventListener('error', fail);
    if (!reduced) { video.src = source; video.load(); }
    return () => {
      controller.abort(); cancelAnimationFrame(raf); clearTimeout(loadTimeout); layoutObserver.disconnect();
      wake.current = () => {};
      window.removeEventListener('scroll', scroll); window.removeEventListener('resize', resize);
      document.removeEventListener('visibilitychange', schedule);
      video.removeEventListener('loadeddata', loaded); video.removeEventListener('seeked', schedule); video.removeEventListener('error', fail);
      video.removeAttribute('src'); video.load();
      if (extractor) { extractor.removeAttribute('src'); extractor.load(); }
      for (const frame of frames) frame.close();
      frames.length = 0;
    };
  }, [source, reduced]);

  return <div ref={rootRef} className="scroll-video fixed inset-0 z-0 overflow-hidden bg-[#0a0a0a] pointer-events-none" data-phase={phase} aria-hidden="true">
    <img src={poster} alt="" width="1920" height="1080" fetchPriority="high" className="scroll-poster" />
    <video ref={videoRef} crossOrigin="anonymous" muted playsInline preload={reduced ? 'none' : 'auto'} poster={poster} />
    <canvas ref={canvasRef} />
  </div>;
}
