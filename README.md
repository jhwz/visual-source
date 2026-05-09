# Visual Source

Visual Source is an opionated GUI for managing your projects design tokens locally.

It supports definings color palettes, color tokens, spacing tokens and more. Please note this is alpha software! It is a proof-of-concept I have found useful for my own projects, but there is still a lot to be done. Feedback and contributions are welcome.

<img width="1465" alt="Screenshot 2025-06-07 at 11 54 16 PM" src="https://github.com/user-attachments/assets/ade38078-a2b5-4300-95fa-a9a696dc606b" />

### Why Visual Source?

When getting started with a new project coming up with design tokens, and then updating them as your refine the look can be a slow process. Visual Source tries to solve this by giving you a design token GUI locally in your project. As you make changes, we regenerate CSS and you see the results in your app immediately! It gives you source of truth to document your tokens, and tools to do things quickly which are otherwise tedious in a text editor.


## Installation

Download the latest version of Visual Source from the [Releases](https://github.com/jhwz/visual-source/releases) page.

## Quick Start

- Launch the GUI by running `visual-source` in the root of your project
- Follow the Getting Started prompt to set up some example tokens
- Visual Source will start generating CSS files for you to reference. To load in your tokens simply import the generated `.visual-source/visual-source.css`


## Concepts

Visual Source has been built flexibly and aims to accomodate the majority of use cases, but does have some assumptions built in.

### Color

Visual Source supports two layers of color tokens: palettes and tokens.

Palettes are variants of a single color (usually shades from light to dark) which can be referenced by other tokens. Tokens directly correspond with the common CSS variables you may have in your app (e.g. `--primary-hover` or `--background`). Tokens are able to reference colors in your palettes, so if you make changes to one they are instantly reflected in the other.

Tokens can be organized into **groups**. A group is a logical set of tokens (e.g. *Background*, *Surface*, *Primary*, *Field*, *Error*) and can apply a CSS prefix to its tokens — so a `Text 01` token in a group with prefix `bg-` is emitted as `--bg-text-01`.

### Contextual tokens (recommended)

The intended way to organize color tokens with Visual Source is **contextual grouping with context classes**.

The idea: define one group per UI surface (Background, Surface, Primary, Field, Error, …), give each group the same set of role tokens (`Text 01`, `Text 02`, `Border`, `Hover`, `Disabled`, …) named consistently, and turn on the **Context** flag for each group. Visual Source will then generate an extra class block per group, aliasing the prefixed tokens to *unprefixed* CSS variables. The first context group (typically Background) also applies to `:root`, so its tokens are the page-wide defaults.

Components then write context-agnostic CSS:

```css
.card {
  background: var(--bg);
  color: var(--text-01);
  border: 1px solid var(--border);
}
.card .help { color: var(--text-02); }
.card:hover { background: var(--hover); }
```

…and the surrounding wrapper picks the context — the same `.card` markup renders correctly on a neutral page, inside a surface, or inside an error region:

```html
<div class="surface"> … card uses surface tokens … </div>
<div class="error">   … card uses error tokens   … </div>
```

This works because CSS custom properties inherit through the DOM. Each context class redefines the unprefixed variables (`--text-01`, `--border`, `--hover`, …) for its subtree, and components pick up whatever's nearest.

**When to deviate.** Some tokens shouldn't change with context — focus rings, scrim/overlay, brand-fixed accents, anchor link colors, selection highlight, shadow elevations, radii. Leave the **Context** flag off on those groups; they'll be emitted as plain CSS variables only and behave globally.

You're not required to use this pattern — non-contextual groups still work fine, and you can mix-and-match. But unless you have a reason to do otherwise, contextual grouping is what the tool is designed around.

### Spacing

Spacing support is currently very rudimentary. We allow you to define one scale of spacing tokens to be used, and these tokens are generated directly into the CSS. There is a lot more we could do here still!

## On the shoulders of giants

This project wouldn't be possible without the work of the open source projects it's built with.

- [Tauri](https://tauri.app/) for the GUI framework and building
- [Svelte/SvelteKit](https://svelte.dev/) for the interface
- [Vite](https://vite.dev/) for the frontend build tool
- [Palette App](https://www.bairesdev.com/tools/color-palette-app/editor/) for the original inspiration
- and many more!

## License

MIT License - see [LICENSE](LICENSE.md) file for details.
