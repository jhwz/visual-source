import { describe, it, expect, vi } from 'vitest'

vi.mock('./environment/index.js', () => ({ environment: 'browser' }))
vi.mock('@tauri-apps/api/core', () => ({ invoke: vi.fn() }))

import { token_value, resolved_spec, type Spec, type Token } from './spec.svelte'

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
})
