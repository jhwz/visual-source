import { describe, it, expect, vi } from 'vitest';

vi.mock('./environment/index.js', () => ({
	environment: 'browser',
	storage: { load_manifest: async () => null, write_outputs: async () => {} }
}));

import { validate } from './validate';

const base = {
	version: 2,
	color: { palettes: [], tokens: [], groups: [] },
	spacing: { scale: [] },
	general: { tokens: [], groups: [] },
	themes: []
};

describe('validate: general tokens', () => {
	it('accepts a valid general section with tokens, groups, and theme overrides', () => {
		const spec = {
			...base,
			general: {
				tokens: [
					{ id: 1, name: 'Radius SM', value: '4px' },
					{ id: 2, name: 'Header Height', value: '64px' }
				],
				groups: [{ id: 1, name: 'Radii', tokens: [1] }]
			},
			themes: [
				{
					id: 1,
					name: 'Compact',
					tokens: [],
					spacing: [],
					general: [{ tokenId: 1, value: '2px' }]
				}
			]
		};
		const result = validate(spec);
		expect(result.errors).toEqual([]);
	});

	it('rejects a general group that references a non-existent general token id', () => {
		const spec = {
			...base,
			general: {
				tokens: [{ id: 1, name: 'Radius SM', value: '4px' }],
				groups: [{ id: 1, name: 'Radii', tokens: [99] }]
			}
		};
		const result = validate(spec);
		expect(result.errors).toContainEqual({
			path: 'general.groups[0].tokens[0]',
			message: 'references non-existent general token id 99'
		});
	});

	it('rejects a theme.general override pointing at a missing general token', () => {
		const spec = {
			...base,
			general: {
				tokens: [{ id: 1, name: 'Radius SM', value: '4px' }],
				groups: []
			},
			themes: [
				{
					id: 1,
					name: 'Compact',
					tokens: [],
					spacing: [],
					general: [{ tokenId: 99, value: '2px' }]
				}
			]
		};
		const result = validate(spec);
		expect(result.errors).toContainEqual({
			path: 'themes[0].general[0].tokenId',
			message: 'references non-existent token id 99'
		});
	});

	it('warns when a general token CSS name collides with a color token name', () => {
		const spec = {
			...base,
			color: {
				palettes: [],
				tokens: [{ id: 1, name: 'Radius', value: '#fff' }],
				groups: []
			},
			general: {
				tokens: [{ id: 2, name: 'Radius', value: '4px' }],
				groups: []
			}
		};
		const result = validate(spec);
		expect(result.errors).toEqual([]);
		expect(result.warnings.some((w) => w.message.includes('--radius'))).toBe(true);
	});
});
