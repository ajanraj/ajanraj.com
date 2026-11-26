# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

This is ajanraj.com, a personal website built with TanStack Start (React) and deployed to Cloudflare. It features a blog, projects showcase, and photos gallery with modern React patterns and server-side rendering.

## Development Commands

```bash
# Core development workflow
bun run dev       # Start dev server on port 3000
bun run build     # Production build
bun run preview   # Preview production build

# Code quality
bun run check     # Run format, lint, and type checks (vp check)
bun run lint      # Run oxlint with type checking (vp lint)
bun run format    # Format code with oxfmt (vp fmt)

# Testing
bun run test      # Run vitest tests (vp test)
```

## Development Workflow Reminders

- Run `bun run check` after all changes to ensure code quality
- Tooling runs through Vite+ (`vp`). Lint and format settings live in the `lint` and `fmt` blocks of `vite.config.ts`; tests use `vitest.config.ts`. Import test APIs from `vite-plus/test`, not `vitest`

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

### Component Conventions

- UI primitives in `src/components/ui/` (Radix-based with CVA)
- Use `cn()` utility for className merging (clsx + tailwind-merge)
- Framer Motion for animations

## Deployment

Deployed to Cloudflare using Nitro with `cloudflare_module` preset. R2 bucket `photos` is bound for photo storage.

<!--VITE PLUS START-->

# Using Vite+, the Unified Toolchain for the Web

This project is using Vite+, a unified toolchain built on top of Vite, Rolldown, Vitest, tsdown, Oxlint, Oxfmt, and Vite Task. Vite+ wraps runtime management, package management, and frontend tooling in a single global CLI called `vp`. Vite+ is distinct from Vite, and it invokes Vite through `vp dev` and `vp build`. Run `vp help` to print a list of commands and `vp <command> --help` for information about a specific command.

Docs are local at `node_modules/vite-plus/docs` or online at https://viteplus.dev/guide/.

## Built-in Commands vs Scripts

`vp <name>` runs a built-in command. `vp run <name>` runs a `package.json` script or a `vite.config.ts` task. Scripts cannot overwrite built-ins, so `vp dev` and `vp run dev` may do different things. Check `package.json` and `vite.config.ts` first, and run `vp run <name>` when the project defines a script or task with that name.

## Running Scripts

Run TypeScript and JavaScript files with `vpx <file>`, for example `vpx ./scripts/seed.ts --dry-run`. It handles enums, decorators, JSX, and tsconfig `paths`, so do not add `tsx` or `ts-node` to run scripts. `vpx --watch <file>` reruns the file when a file it uses changes, in place of `tsx watch`. `vp node <file>` runs plain Node.js.

## Tool Versions

Run `vp toolchain` to show versions and relationships in the active Vite+
release. Add a tool name to select part of the graph. For example, run
`vp toolchain vite`. Use `--global` to ignore the local `vite-plus` package. Use
`vp why <package>` to show the package-manager dependency graph.

## Review Checklist

- [ ] Run `vp install` after pulling remote changes and before getting started.
- [ ] Run `vp check` and `vp test` to format, lint, type check and test changes.
- [ ] Check if there are `vite.config.ts` tasks or `package.json` scripts necessary for validation, run via `vp run <script>`.
- [ ] If setup, runtime, or package-manager behavior looks wrong, run `vp env doctor` and include its output when asking for help.

<!--VITE PLUS END-->
