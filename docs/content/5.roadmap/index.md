---
title: Roadmap
description: Planned features and future direction for Repix.
navigation:
  icon: i-lucide-map
  title: Roadmap
seo:
  title: Roadmap - Repix
  description: Planned features and development roadmap for Repix.
---

A high-level view of where Repix is headed. Priorities may shift based on community feedback and usage.

## Current

These features are available today:

- URL-based transformations (resize, crop, fit modes)
- Format conversion (JPEG, PNG, WebP, AVIF)
- Preset system with configurable defaults
- Quality, blur, sharpen, rotate, flip
- Docker deployment
- `/original` passthrough endpoint

---

## Planned

### Disk / KV cache

Persist transformed images to reduce repeated fetches and processing. Options:

- Local disk cache
- Redis or KV store (Cloudflare KV, Redis)

### Private S3 / R2 storage

Process images from private S3 or R2 buckets using IAM credentials or pre-signed URLs. Support for AWS SDK / S3-compatible storage integration.

### Logging

Request logging (access logs, transformation params, fetch latency) with configurable output (stdout, file) and optional structured formats (JSON).

### Signed / authenticated URLs

Time-limited or HMAC-signed URLs to control access without exposing public transformation endpoints.

---

## Under consideration

### Video thumbnails

Generate thumbnails or poster frames from video files (e.g. MP4) using FFmpeg or similar.

### Overlays / watermarks

Composite logos or watermarks onto images via URL parameters (position, opacity).

### Client hints support

Use `Sec-CH-DPR` and `Sec-CH-Width` to deliver appropriately sized images automatically.

### Smart / face-aware crop

Crop around detected faces or salient regions (similar to Cloudinary/ImageKit) via optional integration.

---

## Contributing

Have ideas or want to work on any of these? [Open an issue](https://github.com/bansal/repix/issues) or submit a pull request on GitHub.
