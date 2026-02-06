import { describe, it, expect } from 'vitest'
import { next_id, find_by_id } from './utils'

describe('next_id', () => {
	it('returns 1 for empty array', () => {
		expect(next_id([])).toBe(1)
	})

	it('returns max + 1 for non-sequential IDs', () => {
		expect(next_id([{ id: 3 }, { id: 1 }, { id: 7 }])).toBe(8)
	})

	it('returns 2 for single item with id 1', () => {
		expect(next_id([{ id: 1 }])).toBe(2)
	})
})

describe('find_by_id', () => {
	const items = [
		{ id: 1, name: 'a' },
		{ id: 2, name: 'b' },
		{ id: 3, name: 'c' }
	]

	it('returns the matching item', () => {
		expect(find_by_id(items, 2)).toEqual({ id: 2, name: 'b' })
	})

	it('throws when item is missing', () => {
		expect(() => find_by_id(items, 99)).toThrow('Internal error: item missing')
	})
})
