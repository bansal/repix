# Repix Image Transformation Service - Test URLs ✅

**Status**: All URLs are now working! The route parameter extraction issue has been fixed.

**Repix** - High-performance image transformation service powered by TypeScript, Hono, and Sharp.

Test image: `https://images.unsplash.com/photo-1749498783004-884cfbba84bf`

## Different Image Formats

### JPEG Format

- **Small JPEG (300x200)**: [http://localhost:3000/images/w=300,h=200,f=jpeg/images.unsplash.com/photo-1749498783004-884cfbba84bf](http://localhost:3000/images/w=300,h=200,f=jpeg/images.unsplash.com/photo-1749498783004-884cfbba84bf)
- **Medium JPEG (600x400)**: [http://localhost:3000/images/w=600,h=400,f=jpeg,q=80/images.unsplash.com/photo-1749498783004-884cfbba84bf](http://localhost:3000/images/w=600,h=400,f=jpeg,q=80/images.unsplash.com/photo-1749498783004-884cfbba84bf)
- **Large JPEG (1200x800)**: [http://localhost:3000/images/w=1200,h=800,f=jpeg,q=90/images.unsplash.com/photo-1749498783004-884cfbba84bf](http://localhost:3000/images/w=1200,h=800,f=jpeg,q=90/images.unsplash.com/photo-1749498783004-884cfbba84bf)

### PNG Format

- **Small PNG (300x200)**: [http://localhost:3000/images/w=300,h=200,f=png/images.unsplash.com/photo-1749498783004-884cfbba84bf](http://localhost:3000/images/w=300,h=200,f=png/images.unsplash.com/photo-1749498783004-884cfbba84bf)
- **Medium PNG (600x400)**: [http://localhost:3000/images/w=600,h=400,f=png/images.unsplash.com/photo-1749498783004-884cfbba84bf](http://localhost:3000/images/w=600,h=400,f=png/images.unsplash.com/photo-1749498783004-884cfbba84bf)
- **Large PNG (1200x800)**: [http://localhost:3000/images/w=1200,h=800,f=png/images.unsplash.com/photo-1749498783004-884cfbba84bf](http://localhost:3000/images/w=1200,h=800,f=png/images.unsplash.com/photo-1749498783004-884cfbba84bf)

### WebP Format

- **Small WebP (300x200)**: [http://localhost:3000/images/w=300,h=200,f=webp/images.unsplash.com/photo-1749498783004-884cfbba84bf](http://localhost:3000/images/w=300,h=200,f=webp/images.unsplash.com/photo-1749498783004-884cfbba84bf)
- **Medium WebP (600x400)**: [http://localhost:3000/images/w=600,h=400,f=webp,q=85/images.unsplash.com/photo-1749498783004-884cfbba84bf](http://localhost:3000/images/w=600,h=400,f=webp,q=85/images.unsplash.com/photo-1749498783004-884cfbba84bf)
- **Large WebP (1200x800)**: [http://localhost:3000/images/w=1200,h=800,f=webp,q=90/images.unsplash.com/photo-1749498783004-884cfbba84bf](http://localhost:3000/images/w=1200,h=800,f=webp,q=90/images.unsplash.com/photo-1749498783004-884cfbba84bf)

### AVIF Format

- **Small AVIF (300x200)**: [http://localhost:3000/images/w=300,h=200,f=avif/images.unsplash.com/photo-1749498783004-884cfbba84bf](http://localhost:3000/images/w=300,h=200,f=avif/images.unsplash.com/photo-1749498783004-884cfbba84bf)
- **Medium AVIF (600x400)**: [http://localhost:3000/images/w=600,h=400,f=avif,q=85/images.unsplash.com/photo-1749498783004-884cfbba84bf](http://localhost:3000/images/w=600,h=400,f=avif,q=85/images.unsplash.com/photo-1749498783004-884cfbba84bf)
- **Large AVIF (1200x800)**: [http://localhost:3000/images/w=1200,h=800,f=avif,q=90/images.unsplash.com/photo-1749498783004-884cfbba84bf](http://localhost:3000/images/w=1200,h=800,f=avif,q=90/images.unsplash.com/photo-1749498783004-884cfbba84bf)

## Different Fit Options

### Cover (default) - crops to fit exact dimensions

- **Cover fit**: [http://localhost:3000/images/w=400,h=400,f=webp,fit=cover/images.unsplash.com/photo-1749498783004-884cfbba84bf](http://localhost:3000/images/w=400,h=400,f=webp,fit=cover/images.unsplash.com/photo-1749498783004-884cfbba84bf)

### Contain - fits entire image within dimensions

- **Contain fit**: [http://localhost:3000/images/w=400,h=400,f=webp,fit=contain/images.unsplash.com/photo-1749498783004-884cfbba84bf](http://localhost:3000/images/w=400,h=400,f=webp,fit=contain/images.unsplash.com/photo-1749498783004-884cfbba84bf)

### Scale-down - like contain but won't upscale

- **Scale-down fit**: [http://localhost:3000/images/w=400,h=400,f=webp,fit=scale-down/images.unsplash.com/photo-1749498783004-884cfbba84bf](http://localhost:3000/images/w=400,h=400,f=webp,fit=scale-down/images.unsplash.com/photo-1749498783004-884cfbba84bf)

## Different Quality Settings

### Low Quality (for faster loading)

- **JPEG Quality 60**: [http://localhost:3000/images/w=800,h=600,f=jpeg,q=60/images.unsplash.com/photo-1749498783004-884cfbba84bf](http://localhost:3000/images/w=800,h=600,f=jpeg,q=60/images.unsplash.com/photo-1749498783004-884cfbba84bf)

### High Quality (for print)

- **JPEG Quality 95**: [http://localhost:3000/images/w=800,h=600,f=jpeg,q=95/images.unsplash.com/photo-1749498783004-884cfbba84bf](http://localhost:3000/images/w=800,h=600,f=jpeg,q=95/images.unsplash.com/photo-1749498783004-884cfbba84bf)

## Width-only or Height-only (maintains aspect ratio)

### Width-only transformations

- **Width 500px**: [http://localhost:3000/images/w=500,f=webp/images.unsplash.com/photo-1749498783004-884cfbba84bf](http://localhost:3000/images/w=500,f=webp/images.unsplash.com/photo-1749498783004-884cfbba84bf)
- **Width 800px**: [http://localhost:3000/images/w=800,f=webp/images.unsplash.com/photo-1749498783004-884cfbba84bf](http://localhost:3000/images/w=800,f=webp/images.unsplash.com/photo-1749498783004-884cfbba84bf)

### Height-only transformations

- **Height 400px**: [http://localhost:3000/images/h=400,f=webp/images.unsplash.com/photo-1749498783004-884cfbba84bf](http://localhost:3000/images/h=400,f=webp/images.unsplash.com/photo-1749498783004-884cfbba84bf)
- **Height 600px**: [http://localhost:3000/images/h=600,f=webp/images.unsplash.com/photo-1749498783004-884cfbba84bf](http://localhost:3000/images/h=600,f=webp/images.unsplash.com/photo-1749498783004-884cfbba84bf)

## Original Image (no transformation)

- **Original**: [http://localhost:3000/images/f=jpeg/images.unsplash.com/photo-1749498783004-884cfbba84bf](http://localhost:3000/images/f=jpeg/images.unsplash.com/photo-1749498783004-884cfbba84bf)

---

## Preset Testing

### Using Predefined Presets

- **Repix Thumb preset**: [http://localhost:3000/images/repix-thumb/images.unsplash.com/photo-1749498783004-884cfbba84bf](http://localhost:3000/images/repix-thumb/images.unsplash.com/photo-1749498783004-884cfbba84bf)
- **Repix Banner preset**: [http://localhost:3000/images/repix-banner/images.unsplash.com/photo-1749498783004-884cfbba84bf](http://localhost:3000/images/repix-banner/images.unsplash.com/photo-1749498783004-884cfbba84bf)
- **Repix Hero preset**: [http://localhost:3000/images/repix-hero/images.unsplash.com/photo-1749498783004-884cfbba84bf](http://localhost:3000/images/repix-hero/images.unsplash.com/photo-1749498783004-884cfbba84bf)
- **Thumbnail preset**: [http://localhost:3000/images/thumbnail/images.unsplash.com/photo-1749498783004-884cfbba84bf](http://localhost:3000/images/thumbnail/images.unsplash.com/photo-1749498783004-884cfbba84bf)
- **Banner preset**: [http://localhost:3000/images/banner/images.unsplash.com/photo-1749498783004-884cfbba84bf](http://localhost:3000/images/banner/images.unsplash.com/photo-1749498783004-884cfbba84bf)

### Testing Preset-Only Mode

To test preset-only functionality:

1. Set `allowCustomTransforms: false` in your config.js:

   ```javascript
   image: {
     allowCustomTransforms: false,
     // ... other settings
   }
   ```

2. Restart the service and try these URLs:

   - **Preset (should work)**: [http://localhost:3000/images/thumbnail/images.unsplash.com/photo-1749498783004-884cfbba84bf](http://localhost:3000/images/thumbnail/images.unsplash.com/photo-1749498783004-884cfbba84bf)
   - **Custom params (should fail)**: [http://localhost:3000/images/w=300,h=200,f=webp/images.unsplash.com/photo-1749498783004-884cfbba84bf](http://localhost:3000/images/w=300,h=200,f=webp/images.unsplash.com/photo-1749498783004-884cfbba84bf)

3. Check presets endpoint: [http://localhost:3000/presets](http://localhost:3000/presets)

---

## Image Preview

![Original Image](https://images.unsplash.com/photo-1749498783004-884cfbba84bf?w=800&h=600)

### Transformed Samples

![Small JPEG](http://localhost:3000/images/w=300,h=200,f=jpeg/images.unsplash.com/photo-1749498783004-884cfbba84bf)
![Medium WebP](http://localhost:3000/images/w=600,h=400,f=webp/images.unsplash.com/photo-1749498783004-884cfbba84bf)

---

## Notes

- Make sure your **Repix** image transformation service is running on `localhost:3000`
- The service needs to have the prefix configured as `https://` to fetch from the source URLs
- All URLs use the format: `/images/{transformation-params}/{image-path}`
- Parameters can use aliases: `w` (width), `h` (height), `f` (format), `q` (quality)
- Supported formats: jpeg, jpg, png, webp, avif
- **Repix** provides high-performance image transformations with optimized presets
