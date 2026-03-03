---
title: Deployment
description: Deploy Repix to popular serverless and container platforms.
navigation:
  icon: i-lucide-rocket
  title: Overview
seo:
  title: Deployment - Repix
  description: Deploy Repix to Render, Railway, Fly.io, and Cloudflare Workers with Sandbox.
---

Repix is Docker-ready and can be deployed to any platform that supports containerized applications. This section covers:

::card-group
  :::card
  ---
  icon: i-simple-icons-render
  to: /deployment/render
  title: Render
  ---
  Deploy Repix as a Web Service on Render. Connect your repo and deploy with one click.
  :::

  :::card
  ---
  icon: i-simple-icons-railway
  to: /deployment/railway
  title: Railway
  ---
  Railway auto-detects Dockerfile and deploys Repix with zero config.
  :::

  :::card
  ---
  icon: i-simple-icons-flyio
  to: /deployment/fly-io
  title: Fly.io
  ---
  Deploy globally with Fly.io's edge infrastructure and Docker support.
  :::

  :::card
  ---
  icon: i-simple-icons-cloudflare
  to: /deployment/cloudflare-sandbox
  title: Cloudflare Sandbox
  ---
  Run Repix in Cloudflare Workers using the Sandbox SDK for isolated container execution.
  :::
::

## Prerequisites

Repix includes a production-ready `Dockerfile` that:

- Uses multi-stage build for minimal image size
- Includes Sharp's native dependencies (libvips)
- Runs as non-root user
- Has health check on `/health`

Ensure your repo has the `Dockerfile` at the root before deploying.
