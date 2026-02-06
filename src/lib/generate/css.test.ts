import { describe, it, expect, vi } from 'vitest'

vi.mock('$lib/environment/index.js', () => ({ environment: 'browser' }))
vi.mock('@tauri-apps/api/core', () => ({ invoke: vi.fn() }))

import { token_css_name, generate_css } from './css'
import type { Spec, Token } from '$lib/spec.svelte'

function make_spec(overrides?: Partial<Spec>): Spec {
	return {
		version: 1,
		color: {
			palettes: [],
			tokens: [],
			groups: []
		},
		spacing: { scale: [] },
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
})
