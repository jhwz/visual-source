import { describe, it, expect, vi } from 'vitest'

vi.mock('./environment/index.js', () => ({
	environment: 'browser',
	storage: { load_manifest: async () => null, write_outputs: async () => {} }
}))

import { token_value, themed_token_value, resolved_spec, type Spec, type Token, type Theme } from './spec.svelte'

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

describe('token_value', () => {
	it('returns literal value', () => {
		const t = { id: 1, name: 'x', value: '#aabbcc' } as Token
		expect(token_value(t)).toBe('#aabbcc')
	})

	it('resolves $ref from provided spec', () => {
		const spec = make_spec({
			color: {
				palettes: [{ id: 1, name: 'p', colors: ['#112233', '#445566'] }],
				tokens: [],
				groups: []
			}
		})
		const t = { id: 1, name: 'x', $ref: '#/color/palettes/1/colors/1' } as Token
		expect(token_value(t, spec)).toBe('#445566')
	})

	it('throws when token has neither value nor $ref', () => {
		const t = { id: 1, name: 'x' } as Token
		expect(() => token_value(t)).toThrow('Token has no value or reference')
	})
})

describe('resolved_spec', () => {
	it('resolves refs in color tokens', () => {
		const spec = make_spec({
			color: {
				palettes: [{ id: 1, name: 'p', colors: ['#aaa', '#bbb'] }],
				tokens: [{ id: 1, name: 'bg', $ref: '#/color/palettes/1/colors/0' } as Token],
				groups: []
			}
		})
		const result = resolved_spec(spec)
		expect(result.color.tokens[0].value).toBe('#aaa')
		expect(result.color.tokens[0]).not.toHaveProperty('$ref')
	})

	it('maps group token IDs to resolved tokens', () => {
		const spec = make_spec({
			color: {
				palettes: [],
				tokens: [
					{ id: 1, name: 'primary', value: '#111' },
					{ id: 2, name: 'secondary', value: '#222' }
				],
				groups: [{ id: 1, name: 'theme', tokens: [2] }]
			}
		})
		const result = resolved_spec(spec)
		expect(result.color.groups[0].tokens).toHaveLength(1)
		expect(result.color.groups[0].tokens[0].name).toBe('secondary')
		expect(result.color.groups[0].tokens[0].value).toBe('#222')
	})

	it('resolves spacing tokens', () => {
		const spec = make_spec({
			spacing: {
				scale: [{ id: 1, name: 'sm', value: '4px' } as Token]
			}
		})
		const result = resolved_spec(spec)
		expect(result.spacing.scale[0].value).toBe('4px')
	})

	it('uses theme overrides when theme is provided', () => {
		const spec = make_spec({
			color: {
				palettes: [],
				tokens: [
					{ id: 1, name: 'bg', value: '#fff' },
					{ id: 2, name: 'fg', value: '#000' }
				],
				groups: []
			}
		})
		const theme: Theme = {
			id: 1,
			name: 'dark',
			tokens: [{ tokenId: 1, value: '#111' }],
			spacing: []
		}
		const result = resolved_spec(spec, theme)
		expect(result.color.tokens[0].value).toBe('#111')
		expect(result.color.tokens[1].value).toBe('#000')
	})
})

describe('themed_token_value', () => {
	it('returns base value when no overrides', () => {
		const t = { id: 1, name: 'x', value: '#aaa' } as Token
		expect(themed_token_value(t, null)).toBe('#aaa')
	})

	it('returns override value when overrides include this token', () => {
		const t = { id: 1, name: 'x', value: '#aaa' } as Token
		expect(themed_token_value(t, [{ tokenId: 1, value: '#bbb' }])).toBe('#bbb')
	})

	it('falls back to base when overrides do not include this token', () => {
		const t = { id: 1, name: 'x', value: '#aaa' } as Token
		expect(themed_token_value(t, [])).toBe('#aaa')
	})

	it('resolves override $ref', () => {
		const spec = make_spec({
			color: {
				palettes: [{ id: 1, name: 'p', colors: ['#112233', '#445566'] }],
				tokens: [],
				groups: []
			}
		})
		const t = { id: 1, name: 'x', value: '#aaa' } as Token
		const overrides = [{ tokenId: 1, $ref: '#/color/palettes/1/colors/1' as any }]
		expect(themed_token_value(t, overrides, spec)).toBe('#445566')
	})
})
