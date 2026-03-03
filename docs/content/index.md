---
seo:
  title: Repix - High-Performance Image Transformation Service
  description: Transform, optimize, and deliver images at lightning speed with Repix's powerful URL-based API. Built with TypeScript, Hono, and Sharp.
---

::u-page-hero
#title
Repix

#description
The high-performance image transformation service. Transform, optimize, and deliver images at lightning speed with Repix's powerful URL-based API.

#links
  :::u-button
  ---
  color: neutral
  size: xl
  to: /getting-started/installation
  trailing-icon: i-lucide-arrow-right
  ---
  Get started
  :::

  :::u-button
  ---
  color: neutral
  icon: simple-icons-github
  size: xl
  to: https://github.com/bansal/repix
  variant: outline
  target: _blank
  ---
  View on GitHub
  :::
::

::u-page-section
#title
Built for developers

#features
  :::u-page-feature
  ---
  icon: i-lucide-sparkles
  ---
  #title
  URL-based API
  
  #description
  Transform images via intuitive URL patterns. No SDK required—just construct URLs with presets or inline parameters.
  :::

  :::u-page-feature
  ---
  icon: i-lucide-zap
  ---
  #title
  Modern Formats
  
  #description
  Full support for JPEG, PNG, WebP, and AVIF. Automatic format conversion with quality optimization.
  :::

  :::u-page-feature
  ---
  icon: i-lucide-layers
  ---
  #title
  Preset System
  
  #description
  General-purpose presets with incremental sizes (xs 64px → xl 1024px → full) for icons, thumbnails, cards, galleries, and more. Define custom presets or restrict to presets for security.
  :::

  :::u-page-feature
  ---
  icon: i-lucide-box
  ---
  #title
  Docker Ready
  
  #description
  Containerized deployment with production-grade Dockerfile. Deploy to Render, Railway, Fly.io, or Cloudflare.
  :::

  :::u-page-feature
  ---
  icon: i-lucide-shield
  ---
  #title
  Secure by Default
  
  #description
  Configurable dimension limits, fetch timeouts, and preset-only mode to prevent abuse.
  :::

  :::u-page-feature
  ---
  icon: i-lucide-gauge
  ---
  #title
  High Performance
  
  #description
  Built with Hono and Sharp for blazing-fast image processing. Vite-powered build for optimal output.
  :::
::

::u-page-section
#title
Default Presets

#description
General-purpose presets with incremental sizes for various use cases—icons, thumbnails, cards, galleries, hero images, and more. Use them out of the box or override with custom presets via the `PRESETS` env var.

#body
| Preset | Value        | Use case |
| ------ | ------------ | -------- |
| `xs`   | `w=64,q=85`  | Icons, favicons |
| `sm`   | `w=128,q=85` | Small thumbnails |
| `md`   | `w=256,q=85` | Cards, list items |
| `lg`   | `w=512,q=85` | Gallery, detail views |
| `xl`   | `w=1024,q=85`| Hero images, lightbox |
| `full` | `q=85`      | Unresized, quality-only |
::

::u-page-section
#title
FAQ

#description
Frequently asked questions about Repix.

#body
### How do I hide my image hosting domain?

Deploy Repix on your own domain (e.g. `img.yourdomain.com`). All image URLs will show your Repix domain—users see `https://img.yourdomain.com/sm/path/to/image.jpg`, not your S3, R2, or CDN origin. The source URL lives in the path, but the browser address bar and referrer show only your domain. Your storage backend stays hidden.

### How do I prevent abuse?

Use several controls together: set `ALLOW_CUSTOM_TRANSFORMS=false` and define presets in `PRESETS` so only allowed transformations work. Lower `IMAGE_MAX_WIDTH` and `IMAGE_MAX_HEIGHT` (e.g. 1024) to cap output size. Reduce `FETCH_TIMEOUT` for slow or abusive origins. Set `ALLOW_ORIGINAL_IMAGE=false` to block unprocessed passthrough. Optionally restrict `CORS_ORIGIN` to your app's domain.

### How do I make URLs clean?

Use presets instead of inline parameters. Compare `https://img.yourdomain.com/sm/example.com/photo.jpg` (clean) vs `https://img.yourdomain.com/w=128,q=85/example.com/photo.jpg` (verbose). Define short preset names in `PRESETS` for your common sizes and fits—e.g. `thumb`, `card`, `hero`—and use those in URLs.

### I have many presets—how do I manage them?

Repix uses the `PRESETS` env var (JSON). Put it in `.env` for easier editing. For many presets, use a single-line JSON string or build it from a script:

```bash
# In .env
PRESETS='{"thumb":"w=200,h=200,fit=cover","card":"w=400,h=300,fit=cover","hero":"w=1200,h=600,fit=cover","avatar":"w=100,h=100,fit=cover,f=webp,q=85"}'
```

You can also keep a `presets.json` file and inject it: `PRESETS=$(cat presets.json)` before starting the server.

### Can I use multiple image sources?

Yes. Repix fetches from any publicly accessible HTTPS URL. Use different domains in the path for each request: `https://img.yourdomain.com/sm/cdn1.com/photo.jpg` and `https://img.yourdomain.com/sm/bucket.s3.amazonaws.com/other.png` both work. `SOURCE_PREFIX` (default `https://`) is prepended to the path, so you can mix S3, R2, your CDN, and other origins in the same Repix instance. To restrict which origins are allowed, set `SOURCE_HOSTNAME` to a comma-separated list (e.g. `cdn.example.com,images.example.com`); when set, only those hostnames are accepted.
::
