# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

Visual Source is a Tauri 2 desktop application for managing design tokens (color palettes, color tokens, spacing tokens). It generates CSS custom properties and JSON files automatically as users make changes. Built with SvelteKit (static adapter) for the frontend and Rust for the backend.

## Commands

| Command | Purpose |
|---------|---------|
| `bun run dev` | Launch Tauri app in dev mode (Vite on port 1420 + Rust) |
| `bun run build` | Production build of the Tauri app |
| `bun run check` | Type-check TypeScript and Svelte files |
| `bun run check:watch` | Type-check in watch mode |
| `bun run format` | Format `src/` with Prettier |
| `bun run vite-dev` | Run only the Vite dev server (no Tauri) |
| `bun run test` | Run unit tests (Vitest, single run) |
| `bun run test:watch` | Run unit tests in watch mode |
| `bun run vite-build` | Build only the frontend |

`bun run check` (svelte-check + TypeScript) is the primary type-checking step. `bun run test` runs Vitest unit tests.

## Architecture

### Stack
- **Frontend**: SvelteKit 2 + Svelte 5 (runes mode) + TypeScript (strict)
- **Desktop**: Tauri 2 (Rust backend in `src-tauri/`)
- **Build**: Vite, adapter-static (SSR disabled, CSR only)
- **Package manager**: Bun

### Core Data Model (`src/lib/spec.svelte.ts`)

Central `Spec` type holds all application state as a single reactive object using `$state()`. Changes auto-persist to `.visual-source/manifest.json` and auto-generate output files via `$effect`.

```
Spec
├── color
│   ├── palettes[]    — Color scales (arrays of shades)
│   ├── tokens[]      — Named tokens with $ref to palette colors
│   └── groups[]      — Logical groupings with optional CSS prefix / context flag
├── spacing
│   └── scale[]       — Spacing tokens
└── general
    ├── tokens[]      — Arbitrary CSS values (radii, sizes, transitions, …)
    └── groups[]      — Documentation-only groups (no prefix, no context)
```

### Token Reference System (`src/lib/reftype.ts`)

Tokens use JSON-pointer-style `$ref` strings (e.g. `#/color/palettes/0/colors/5`) to link to palette colors. The type system enforces valid paths at compile time via recursive `DeepPath` types. `resolve_ref()` resolves references at runtime.

### Code Generation (`src/lib/generate/`)

- **`css.ts`** — Generates CSS custom properties with both hex (`--token`) and RGB (`--token-rgb`) variants. Groups with `context: true` additionally emit a class block (`.bg`, `.surface`, …) aliasing prefixed tokens to unprefixed CSS variables; the first such group also applies to `:root`. General tokens emit in their own `/* GENERAL TOKENS */` block with single (no `-rgb`) variables and no prefix application.
- **`json.ts`** — Exports resolved token values as JSON.
- **`dtcg.ts`** — Exports the spec in [DTCG](https://design-tokens.github.io/community-group/format/) format. Palettes go under `color.palettes.<name>.<NN>`; color/general tokens nest under their group (or sit at the section root if ungrouped); `$ref`s are translated to DTCG `{path.to.token}` references; themes go under `$extensions["com.visualsource.themes"]` because DTCG hasn't standardised mode/theme yet.

Output goes to `.visual-source/visual-source.css` and `.visual-source/visual-source.json`.

### Agent Instructions (`src/lib/agent-instructions.ts`)

A single exported string (`AGENT_INSTRUCTIONS`) that the GUI writes to `.visual-source/AGENTS.md` and `.visual-source/CLAUDE.md` on save. This is the documentation that downstream-project agents (Claude Code, etc.) read when editing a consumer's `manifest.json` directly. It documents the schema, the editing workflow, the CLI commands, and the recommended authoring patterns (contextual grouping, context classes).

### Environment Abstraction (`src/lib/environment/`)

Detects Tauri vs browser at runtime. Browser fallback allows frontend development without compiling Rust — use `bun run vite-dev` for frontend-only dev.

### Rust Backend (`src-tauri/src/`)

- `main.rs` — CLI (Clap) with `init` subcommand + GUI launcher. Auto-detects project root via `node_modules`.
- `lib.rs` — Tauri commands: `get()` reads manifest, `write()` saves generated files.
- Uses `VISUAL_SOURCE_ROOT` env var to override project root detection.

### Routing (`src/routes/`)

Three pages: color tokens (home), palettes, spacing. Layout in `+layout.svelte` provides sidebar navigation and palette management.

### Presets (`src/lib/data/`)

Ships with Tailwind CSS and Open Color palettes, plus Tailwind spacing scale as importable starting points.

## Keeping agent instructions in sync

`src/lib/agent-instructions.ts` is the source of truth for the per-project `AGENTS.md` / `CLAUDE.md` that ships into every consumer's `.visual-source/` directory. Downstream-project agents read these to understand how to edit `manifest.json` correctly. **It must stay in lockstep with the code.**

When you change any of the following, update `agent-instructions.ts` in the same change:

- The `Spec` / `Token` / `TokenGroup` / `Palette` / `Theme` types in `src/lib/spec.ts` — the schema section in the agent instructions documents these directly.
- The set of fields a manifest entity accepts (e.g. adding `context?: boolean` to `TokenGroup` requires both a schema-line update and an explanation of the new behavior).
- CSS / JSON generation behavior (`src/lib/generate/`) that a hand-editing agent needs to know about — e.g. new selectors, naming rules, or output sections.
- CLI commands or flags exposed by `src-tauri/src/main.rs` — the *Editing workflow* and *Other CLI commands* sections list these.
- Validation rules in `src/lib/validate.ts` if they affect what an agent must produce.
- Recommended authoring patterns (e.g. the contextual grouping convention).

Likewise update `README.md` if the change is user-facing enough to belong in the public concepts overview (e.g. a new authoring pattern), and confirm the existing docs for unchanged areas still read correctly after your edit.

A change that ships new behavior without updating the agent instructions will silently mislead every consumer's agent. Treat the doc edit as part of the change, not a follow-up.

## Code Style

- **Svelte 5 runes**: `$state()`, `$derived`, `$effect`, `$props()` — no legacy `let` reactivity
- **Tabs** for indentation, **single quotes**, **no trailing commas**, 100-char line width
- Custom HTML elements for semantic layout (`<page-grid>`, `<page-sidebar>`, `<app-name>`)
- Color math is hand-rolled in `src/lib/colors.ts` (hex/RGB/HSV conversions)
