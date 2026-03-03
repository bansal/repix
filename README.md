# Repix

Self-hosted image CDN with on-the-fly transformation. Built with TypeScript, Hono, and Sharp.

**[Full documentation →](https://repix.bansal.io)**

## Quick Start

```bash
npm install
cp .env.example .env
# Edit .env with your settings
npm run dev
```

Or with Docker:

```bash
docker compose up -d
```

## URL Pattern

```
/{preset|rules}/{url-without-prefix}
```

Examples:

```
https://your-domain.com/sm/example.com/path/to/image.jpg
https://your-domain.com/w=400,h=300,fit=cover/example.com/path/to/image.jpg
```

---

Built by **[Jiten Bansal](https://bansal.io)** · MIT License
