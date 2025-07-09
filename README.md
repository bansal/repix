# Image Resize Service

A high-performance image resize service, built with Hono and Sharp.

## Features

- **Image Transformations**: Resize, crop, format conversion, quality adjustment
- **Multiple Fit Modes**: cover, contain, scale-down, crop, pad
- **Format Support**: JPEG, PNG, WebP, AVIF
- **Preset System**: Define reusable transformation presets
- **Environment Configuration**: Support for both config file and environment variables
- **Docker Ready**: Containerized deployment support
- **URL-based API**: Transform images via URL parameters

## Quick Start

1. Install dependencies:

```bash
npm install
```

2. Configure the service:

```bash
cp config.example.js config.js
# Edit config.js with your settings
```

3. Start the service:

```bash
npm run dev
```

## URL Pattern

Transform images using this URL pattern:

```
https://your-domain.com/images/{preset|rules}/{url-without-prefix}
```

### Examples

Using presets:

```
https://your-domain.com/images/thumbnail/example.com/path/to/image.jpg
```

Using direct rules:

```
https://your-domain.com/images/w=400,h=300,fit=cover/example.com/path/to/image.jpg
```

## Configuration

The service supports configuration via both `config.js` and environment variables. Environment variables override config file settings.

### Available Options

- `prefix`: Source URL prefix (default: 'https://')
- `port`: Server port (default: 3000)
- `presets`: Object containing named transformation presets
- `image.allowCustomTransforms`: Whether to allow custom transformations beyond presets (default: true)

### Security Configuration

You can restrict image transformations to only use predefined presets by setting `allowCustomTransforms` to `false`:

```javascript
export default {
  image: {
    allowCustomTransforms: false, // Only allow predefined presets
    maxWidth: 4096,
    maxHeight: 4096,
    // ... other image settings
  },
  presets: {
    thumbnail: "w=200,h=200,fit=cover,f=webp,q=85",
    banner: "w=1024,h=128,fit=cover,f=webp,q=85",
  },
};
```

When `allowCustomTransforms` is `false`, users can only use the transformation URLs with predefined preset names. Any attempt to use custom parameters will result in an error.

### Example Configuration

```javascript
export default {
  prefix: "https://",
  port: 3000,
  presets: {
    thumbnail: "w=200,h=200,fit=cover",
    banner: "w=1024,h=128,fit=cover",
    avatar: "w=100,h=100,fit=cover,f=webp,q=85",
  },
};
```

## Transformation Parameters

| Parameter      | Description              | Example            |
| -------------- | ------------------------ | ------------------ |
| `w`, `width`   | Maximum width in pixels  | `w=400`            |
| `h`, `height`  | Maximum height in pixels | `h=300`            |
| `fit`          | Resize mode              | `fit=cover`        |
| `f`, `format`  | Output format            | `f=webp`           |
| `q`, `quality` | Quality (1-100)          | `q=85`             |
| `blur`         | Blur radius (1-250)      | `blur=10`          |
| `sharpen`      | Sharpening (0-10)        | `sharpen=2`        |
| `rotate`       | Rotation degrees         | `rotate=90`        |
| `flip`         | Flip direction           | `flip=h`           |
| `background`   | Background color         | `background=white` |

### Fit Modes

- `cover`: Resize and crop to fill dimensions
- `contain`: Resize to fit within dimensions
- `scale-down`: Like contain, but never enlarge
- `crop`: Crop to exact dimensions
- `pad`: Resize and pad with background color

## Docker

Build and run with Docker:

```bash
docker build -t image-resize-service .
docker run -p 3000:3000 image-resize-service
```

## License

MIT
