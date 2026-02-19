---
title: Migration
description: Migrate from Cloudinary, ImageKit, and other image CDNs to Repix.
navigation:
  icon: i-lucide-arrow-right-left
  title: Overview
seo:
  title: Migration - Repix
  description: Migrate image delivery from Cloudinary, ImageKit to self-hosted Repix.
---

Migrate to Repix from popular image CDNs with minimal code changes.

::card-group
  :::card
  ---
  icon: i-lucide-cloud
  to: /migration/cloudinary
  title: Cloudinary
  ---
  Parameter mapping and migration steps for Cloudinary users.
  :::

  :::card
  ---
  icon: i-lucide-image
  to: /migration/imagekit
  title: ImageKit
  ---
  Parameter mapping and migration steps for ImageKit users.
  :::
::

## What You'll Need

- Repix deployed and accessible (e.g. `https://img.yourdomain.com`)
- Source images hosted and publicly accessible (S3, R2, CDN, etc.)
- Your app’s image URL generation logic to update

## Parameter Quick Reference

| Platform   | Width | Height | Crop/Fit | Format | Quality |
| ---------- | ----- | ------ | -------- | ------ | ------- |
| **Cloudinary** | `w_400` | `h_300` | `c_fill` | `f_webp` | `q_85` |
| **ImageKit**   | `w-400` | `h-300` | `cm-extract` | `fo-webp` | `q-85` |
| **Repix**      | `w=400` | `h=300` | `fit=cover` | `f=webp` | `q=85` |
