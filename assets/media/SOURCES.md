# Hero media

## Active: NovaAI reference scroll video

The user supplied a new scroll-recreation brief on 2026-09-17 and requested UI/UX
adaptation for the existing enterprise-training content.

- Exact source: https://d8j0ntlcm91z4.cloudfront.net/user_38xzZboKViGWJOttwIXH07lWA1P/hf_20260729_102822_0e6c87e8-c141-4744-bf32-ad30db296371.mp4
- Local mirror: `enterprise-scroll.mp4`, unchanged original bytes.
- H.264, 1920×1080, 24 fps, 10.041667 seconds; no audio stream.
- Size: 10,321,675 bytes; MD5 matches source ETag: `806d3c91cd585a6e677514da5efca637`.
- SHA-256: `9706ce8a7a83047654c0fb4833a413e6a7d164df09d1f7ae6b0d26f9d1d5e18e`.
- First-frame JPEG: `enterprise-scroll-poster.jpg`, extracted with FFmpeg quality 2.
- Poster SHA-256: `99fd547a8534eaa0752c1fc89d56d318639d01cc47b3019e7478160b72fd79f7`.

Production prefers the exact CloudFront source; local preview uses the mirror.
Network/CORS failure switches production to the same-origin copy. Reduced motion
does not request the video. The player never autoplays or loops: page scroll maps
to the video timeline. A maximum of 90 cached frames at 960px is used on desktop;
mobile/low-memory devices use up to 48 at 640px. Unavailable caching falls back to
seeking the video. All three visual layers share CSS brightness .46 to support
white text over the unusually bright original. No opaque overlay or different
video is introduced. The original bytes remain unmodified.

The unrelated Mitha portrait in the reference is not used as a photograph of
Maggie. The contact card uses the existing New Oriental mark.

## Preserved: workplace English learning scene

The user approved “learn → practice → apply” and requested one Atlas Cloud
MiniMax H3 video on 2026-09-17. This is an AI-generated learning illustration,
not footage of a real client, class, or product interface.

- First/end frame: built-in image2, actual 1672×941 PNG. All visible English text
  was generated in the image/video, not composited afterward.
- Provider/model: Atlas Cloud `minimax/h3/image-to-video`, standard 2K,
  12-second request, adaptive aspect ratio, prompt expansion disabled.
- Exactly one task: `827489a725524bcb89cf3ddc1ff45a6c`, completed.
- Quoted cost: USD 1.56. This is the saved API quote, not a billing statement.
- Provider output: https://atlas-media.oss-us-west-1.aliyuncs.com/videos/442645821358204.mp4
- Raw output: 2560×1440, 24 fps, 12.25 seconds, 1,526,505 bytes, H.264 + AAC.
- Raw SHA-256: `290dc4c381a3d288354799f3e5439cdcd599dd9a572c97609d9863acc4b34d71`.
- Web copy: `enterprise-learning-h3.mp4`, 1920×1080, 24 fps, full 12.25 seconds,
  H.264/yuv420p, audio removed, fast-start MP4, 1,187,413 bytes.
- Web SHA-256: `e67a039b9cbf25519851141baef0702b24c058f162bf80b2616720fe8a1e900f`.
- Poster: `enterprise-learning-h3-poster.jpg`, first decoded web frame,
  1920×1080, JPEG quality 2, 94,263 bytes.
- Poster SHA-256: `0a8855c20ac81af59743939fe6f70d0f829a7ec18cc6e52f68faafda016629c0`.
- Production prompts, source image, raw video, and non-secret receipts:
  `../../production/enterprise-h3-20260917/`.

The web version is a resize/encode only: no extra text, overlays, cuts, time
reversal, or paid regeneration. The opening and last frame SSIM is 0.996038;
sampled visual inspection shows the scene returning to its starting state.
This measurement does not substitute for the user's subjective playback review.

Vite imports the video and poster into content-hashed, same-origin assets. The
poster remains behind the video for loading, errors, and reduced motion. A
contained frame prevents the new subject from being cropped; mobile spacing
places it below the headline/CTA and above the floating navigation. No external
video host is contacted by the webpage.

## Preserved: original user-supplied video

The user supplied this video for the new enterprise homepage and approved serving
the same video with the site plus a first-frame fallback on 2026-09-17.

- Original URL: https://d8j0ntlcm91z4.cloudfront.net/user_38xzZboKViGWJOttwIXH07lWA1P/hf_20260505_101331_74f9b798-3f00-4e86-8a01-377aa16ffeaa.mp4
- Local copy: `enterprise-hero.mp4`, unchanged original bytes.
- Length: 12.041667 seconds; H.264, 1920 × 1080, 24 fps; no audio stream.
- Size: 2,788,688 bytes.
- Source ETag / verified local MD5: `671571ff2d7eac1356e6b4b839e24fc0`.
- SHA-256: `84882d84197946ee4ca32815ca8dd80684f11c13aa22cfc07f30d4a617c67ea3`.
- Poster: `enterprise-hero-poster.jpg`, first decoded frame extracted with FFmpeg,
  original dimensions, JPEG quality 2. No generated imagery, added text, or overlays.

These original files are retained for comparison and rollback, but are no longer
imported into the current feature-branch webpage.
