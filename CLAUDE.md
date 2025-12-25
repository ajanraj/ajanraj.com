# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

This is ajanraj.com, a personal website built with TanStack Start (React) and deployed to Cloudflare. It features a blog, projects showcase, photos gallery, and quotes page with modern React patterns and server-side rendering.

## Development Commands

```bash
# Core development workflow
bun run dev       # Start dev server on port 3000
bun run build     # Production build
bun run preview   # Preview production build

# Code quality
bun run check     # Run linter + format check
bun run lint      # Run oxlint with type checking
bun run format    # Format code with oxfmt

# Testing
bun run test      # Run vitest tests
```

## Development Workflow Reminders

- Run `bun run check` after all changes to ensure code quality
- The project uses oxlint and oxfmt (not ESLint/Prettier)

## Architecture

### Tech Stack

- **Framework**: TanStack Start (React 19 + TanStack Router)
- **Styling**: Tailwind CSS v4
- **Content**: Content Collections for Markdown processing
- **Backend**: Nitro server
- **Deployment**: Cloudflare (with R2 for photos storage)
- **Package Manager**: Bun

### Directory Structure

- `src/routes/` - File-based routing (TanStack Router)
- `src/components/` - React components (with `ui/` for primitives)
- `src/lib/` - Shared utilities and helpers
- `src/data/` - Data fetching and static data
- `src/integrations/` - External service integrations
- `content/writing/` - Markdown blog posts
- `public/` - Static assets

### Content Format

Blog posts are written in Markdown with YAML frontmatter in `content/writing/`:

```markdown
---
title: "Post Title"
publishedAt: "2025-01-01"
summary: "Brief description"
tags: ["tag1", "tag2"]
---

Content in Markdown format...
```

### Key Routes

- `/` - Homepage
- `/writing/` - Blog posts
- `/projects/` - Projects showcase
- `/photos/` - Photo gallery (uses Cloudflare R2)
- `/quotes/` - Quotes collection

### Component Conventions

- UI primitives in `src/components/ui/` (Radix-based with CVA)
- Use `cn()` utility for className merging (clsx + tailwind-merge)
- Framer Motion for animations

## Deployment

Deployed to Cloudflare using Nitro with `cloudflare_module` preset. R2 bucket `photos` is bound for photo storage.
