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

Visual Source supports two layers of color tokens, palettes and tokens.

Palettes are variants of a single color (usually shades from light to dark) which can be referenced by other tokens. Tokens directly correspond with the common CSS variables you may have in your app (e.g. `--primary-hover` or `--background`). Tokens are able to reference colors in your palettes, so if you make changes to one they are instantly reflected in the other.

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
