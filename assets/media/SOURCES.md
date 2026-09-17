# Hero media

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

Both assets are imported by Vite and included in the deployment with content-hashed
filenames. The browser no longer requests the CloudFront source. The poster sits
behind the video and is also its native `poster`: loading, media errors, or reduced
motion cannot leave the hero without its original visual. Mobile cropping remains
the same as the video layout.
