import { describe, it, expect } from 'vitest'
import { resolve_ref } from './reftype'

describe('resolve_ref', () => {
	it('resolves a simple object path', () => {
		const spec = { color: { name: 'red' } }
		expect(resolve_ref(spec, '#/color/name' as any)).toBe('red')
	})

	it('resolves array with id-based lookup', () => {
		const spec = {
			color: {
				palettes: [
					{ id: 1, name: 'warm', colors: ['#ff0000', '#ff8800'] },
					{ id: 2, name: 'cool', colors: ['#0000ff', '#0088ff'] }
				]
			}
		}
		expect(resolve_ref(spec, '#/color/palettes/2/colors/1' as any)).toBe('#0088ff')
	})

	it('resolves nested path through objects and arrays', () => {
		const spec = {
			color: {
				palettes: [{ id: 5, name: 'primary', colors: ['#aabbcc'] }]
			}
		}
		expect(resolve_ref(spec, '#/color/palettes/5/name' as any)).toBe('primary')
	})
})
