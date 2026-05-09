import { describe, it, expect, vi } from 'vitest'

vi.mock('$lib/environment/index.js', () => ({
	environment: 'browser',
	storage: { load_manifest: async () => null, write_outputs: async () => {} }
}))

import { token_css_name, generate_css } from './css'
import type { Spec, Token } from '$lib/spec.svelte'

function make_spec(overrides?: Partial<Spec>): Spec {
	return {
		version: 2,
		color: {
			palettes: [],
			tokens: [],
			groups: []
		},
		spacing: { scale: [] },
		themes: [],
		...overrides
	} as Spec
}

describe('token_css_name', () => {
	it('uses kebab-cased name for a plain token', () => {
		const t = { id: 1, name: 'Primary Color', value: '#fff' } as Token
		expect(token_css_name(t, [])).toBe('primary-color')
	})

	it('uses css.name override when present', () => {
		const t = { id: 1, name: 'Primary Color', value: '#fff', css: { name: 'brand' } } as Token
		expect(token_css_name(t, [])).toBe('brand')
	})

	it('prepends group prefix', () => {
		const t = { id: 1, name: 'Background', value: '#fff' } as Token
		const groups = [{ tokens: [1], css: { prefix: 'theme-' } }]
		expect(token_css_name(t, groups)).toBe('theme-background')
	})
})

describe('generate_css', () => {
	it('generates CSS for a minimal spec with one token', () => {
		const spec = make_spec({
			color: {
				palettes: [],
				tokens: [{ id: 1, name: 'Primary', value: '#ff0000' }],
				groups: []
			}
		})
		const css = generate_css(spec)
		expect(css).toContain('--primary: #ff0000;')
		expect(css).toContain('--primary-rgb: 255 0 0;')
	})

	it('generates CSS for a palette', () => {
		const spec = make_spec({
			color: {
				palettes: [{ id: 1, name: 'Blue', colors: ['#0000ff'] }],
				tokens: [],
				groups: []
			}
		})
		const css = generate_css(spec)
		expect(css).toContain('PALETTE Blue')
		expect(css).toContain('--blue-01: #0000ff;')
		expect(css).toContain('--blue-01-rgb: 0 0 255;')
	})

	it('generates CSS for spacing', () => {
		const spec = make_spec({
			spacing: {
				scale: [{ id: 1, name: 'Small', value: '0.5rem' }]
			}
		})
		const css = generate_css(spec)
		expect(css).toContain('SPACING')
		expect(css).toContain('--small: 0.5rem;')
	})

	it('handles empty spec', () => {
		const css = generate_css(make_spec())
		expect(css).toContain('COLOR TOKENS')
		expect(css).not.toContain('PALETTE')
		expect(css).not.toContain('SPACING')
	})

	it('generates theme override blocks', () => {
		const spec = make_spec({
			color: {
				palettes: [],
				tokens: [{ id: 1, name: 'Background', value: '#ffffff' }],
				groups: []
			},
			themes: [
				{
					id: 1,
					name: 'Dark',
					tokens: [{ tokenId: 1, value: '#000000' }],
					spacing: []
				}
			]
		})
		const css = generate_css(spec)
		expect(css).toContain('[data-theme="dark"]')
		expect(css).toContain('--background: #000000;')
	})

	it('generates theme override for spacing', () => {
		const spec = make_spec({
			spacing: {
				scale: [{ id: 1, name: 'Small', value: '0.5rem' }]
			},
			themes: [
				{
					id: 1,
					name: 'Compact',
					tokens: [],
					spacing: [{ tokenId: 1, value: '0.25rem' }]
				}
			]
		})
		const css = generate_css(spec)
		expect(css).toContain('[data-theme="compact"]')
		expect(css).toContain('--small: 0.25rem;')
	})

	it('emits context class blocks for groups with context: true', () => {
		const spec = make_spec({
			color: {
				palettes: [],
				tokens: [
					{ id: 1, name: 'Background', value: '#ffffff', css: { name: 'bg' } },
					{ id: 2, name: 'Text 01', value: '#111111' },
					{ id: 3, name: 'Border', value: '#dddddd' },
					{ id: 4, name: 'Surface', value: '#f5f5f5', css: { name: 'surface' } },
					{ id: 5, name: 'Text 01', value: '#222222' },
					{ id: 6, name: 'Border', value: '#cccccc' },
					{ id: 7, name: 'Error', value: '#fef2f2', css: { name: 'error' } },
					{ id: 8, name: 'Text 01', value: '#991b1b' }
				],
				groups: [
					{ id: 1, name: 'Background', tokens: [1, 2, 3], context: true, css: { prefix: 'bg-' } },
					{
						id: 2,
						name: 'Surface',
						tokens: [4, 5, 6],
						context: true,
						css: { prefix: 'surface-' }
					},
					{ id: 3, name: 'Error', tokens: [7, 8], context: true, css: { prefix: 'error-' } }
				]
			}
		})
		const css = generate_css(spec)

		// First context group also applies to :root
		expect(css).toContain('/* CONTEXT: Background */\n:root, .bg {')
		expect(css).toContain('--text-01: var(--bg-text-01);')
		expect(css).toContain('--text-01-rgb: var(--bg-text-01-rgb);')
		expect(css).toContain('--border: var(--bg-border);')

		// Subsequent context groups do not include :root
		expect(css).toContain('/* CONTEXT: Surface */\n.surface {')
		expect(css).not.toContain(':root, .surface')
		expect(css).toContain('--text-01: var(--surface-text-01);')
		expect(css).toContain('--border: var(--surface-border);')

		expect(css).toContain('/* CONTEXT: Error */\n.error {')
		expect(css).toContain('--text-01: var(--error-text-01);')

		// Tokens whose full css name does not start with the group prefix
		// (here, the css.name-overridden Background/Surface/Error tokens
		// themselves) are skipped — there's no prefix to strip.
		const bg_block = css.match(/:root, \.bg \{[\s\S]*?\}/)![0]
		expect(bg_block).not.toContain('--bg: var(--bg);')
		const surface_block = css.match(/\.surface \{[\s\S]*?\}/)![0]
		expect(surface_block).not.toContain('--surface: var(--surface);')
	})

	it('does not emit context blocks for groups without context: true', () => {
		const spec = make_spec({
			color: {
				palettes: [],
				tokens: [{ id: 1, name: 'Text 01', value: '#111111' }],
				groups: [{ id: 1, name: 'Background', tokens: [1], css: { prefix: 'bg-' } }]
			}
		})
		const css = generate_css(spec)
		expect(css).not.toContain('CONTEXT:')
		expect(css).not.toContain(':root, .bg')
	})

	it('skips context groups without a css prefix', () => {
		const spec = make_spec({
			color: {
				palettes: [],
				tokens: [{ id: 1, name: 'Text 01', value: '#111111' }],
				groups: [{ id: 1, name: 'Background', tokens: [1], context: true }]
			}
		})
		const css = generate_css(spec)
		expect(css).not.toContain('CONTEXT:')
	})

	it('does not generate theme block when no themes exist', () => {
		const spec = make_spec({
			color: {
				palettes: [],
				tokens: [{ id: 1, name: 'Primary', value: '#ff0000' }],
				groups: []
			}
		})
		const css = generate_css(spec)
		expect(css).not.toContain('data-theme')
	})
})
