# Sertraline Blog

[![Netlify Status](https://api.netlify.com/api/v1/badges/83182786-c11e-4e28-b81d-9bab206ba544/deploy-status)](https://app.netlify.com/sites/tranquil-melomakarona-5b7804/deploys)

Sertraline is Saro's personal Persian blog. The site is built with Gatsby, MDX, React, TypeScript, and Theme UI.

The name can sound medical, but this repository currently powers a personal/literary blog. The site is not a medication guide, does not provide medical advice, and should not be treated as a substitute for care from a clinician, therapist, psychiatrist, psychologist, or pharmacist.

## Stack

- Gatsby 5
- React 18
- TypeScript
- MDX content files
- Theme UI
- Netlify hosting

## Local Development

Use Node 20 or the version from `.nvmrc`.

```sh
npm ci
npm run develop
```

The local site runs at `http://localhost:8000`.

## Useful Scripts

```sh
npm run validate:content
npm run typecheck
npm run build
npm run check
```

`npm run check` validates content metadata, runs TypeScript, and builds the site.

## Content Workflow

Published posts live in `content/posts`. Static pages live in `content/pages`.

Every post should include:

```yaml
---
title: "Post title"
date: 2020-08-26
description: "Short, safe summary for SEO, RSS, and previews."
tags:
  - یادداشت‌ها
banner: ./optional-image.jpg
---
```

Rules for content metadata:

- `date` must use `YYYY-MM-DD`.
- `description` should be under 180 characters.
- Descriptions should not contain abrupt crisis/self-harm wording.
- Sensitive posts should start with a visible content warning.
- Images that carry meaning should have an accessible alt strategy before future CMS migration.

## Editorial Notes

This project treats mental-health-adjacent content carefully:

- Personal writing is not medical guidance.
- Medication or health explainers should not be added without reliable sources and a clear review/update process.
- Posts that mention crisis, self-harm, or other sensitive experiences should include a warning before the body text.
- Future Sanity migration should preserve slugs, dates, descriptions, warnings, tags, authorship, and source fields.

## Deployment

The production site is deployed on Netlify. GitHub Actions currently runs validation/build checks; it does not deploy to GitHub Pages.

## Future CMS Direction

Sanity can be introduced later if the blog needs a web editor, draft workflow, structured media metadata, or source/review fields for health-related content. The current priority is to keep the Gatsby/MDX site clean, buildable, and well-modeled before moving content into a CMS.
