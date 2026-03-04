# Repix

Self-hosted image transformation service. Resize, crop, and convert images on-the-fly via URL. Built with TypeScript, Hono, and Sharp.

**[Documentation →](https://repix.bansal.io)**

[![Deploy on Railway](https://railway.com/button.svg)](https://railway.com/deploy/repix?referralCode=14VXYW&utm_medium=integration&utm_source=template&utm_campaign=generic)

## What it does

Repix fetches images from any public HTTPS URL, applies transformations (resize, crop, format conversion), and returns the result. No SDK—just construct URLs.

**URL pattern:** `/{preset|rules}/{url-without-https-prefix}`

```
https://your-domain.com/sm/example.com/path/to/image.jpg
https://your-domain.com/w=400,h=300,fit=cover/example.com/path/to/image.jpg
```

## Quick start

```bash
git clone https://github.com/bansal/repix.git
cd repix
npm install
cp .env.example .env
# Edit .env if needed
npm run dev
```

Server runs at http://localhost:3210

**Docker:**

```bash
docker compose up -d
```

## Requirements

- Node.js 22+
- Sharp uses native bindings; the Docker image includes dependencies

## License

MIT · [Jiten Bansal](https://bansal.io)
