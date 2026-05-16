import { describe, expect, it } from 'vitest';
import { make_spec } from '../test-helpers.js';
import { validate } from '../validate.js';
import { color, general } from './index.js';

describe('color.delete_token', () => {
	it('removes the token from spec.color.tokens', () => {
		const spec = make_spec({
			color: {
				palettes: [],
				tokens: [
					{ id: 1, name: 'a', value: '#000' },
					{ id: 2, name: 'b', value: '#fff' }
				],
				groups: []
			}
		});
		color.delete_token(spec, 1);
		expect(spec.color.tokens.map((t) => t.id)).toEqual([2]);
		expect(validate(spec).errors).toEqual([]);
	});

	it('removes the token id from every group', () => {
		const spec = make_spec({
			color: {
				palettes: [],
				tokens: [
					{ id: 1, name: 'a', value: '#000' },
					{ id: 2, name: 'b', value: '#fff' }
				],
				groups: [
					{ id: 1, name: 'g1', tokens: [1, 2] },
					{ id: 2, name: 'g2', tokens: [1] }
				]
			}
		});
		color.delete_token(spec, 1);
		expect(spec.color.groups[0].tokens).toEqual([2]);
		expect(spec.color.groups[1].tokens).toEqual([]);
		expect(validate(spec).errors).toEqual([]);
	});

	it('drops theme overrides keyed by the deleted token', () => {
		const spec = make_spec({
			color: {
				palettes: [],
				tokens: [{ id: 1, name: 'a', value: '#000' }],
				groups: []
			},
			themes: [
				{
					id: 1,
					name: 'dark',
					tokens: [{ tokenId: 1, value: '#111' }],
					spacing: [],
					general: []
				}
			]
		});
		color.delete_token(spec, 1);
		expect(spec.themes[0].tokens).toEqual([]);
		expect(validate(spec).errors).toEqual([]);
	});

	it('is a no-op when the token does not exist', () => {
		const spec = make_spec({
			color: {
				palettes: [],
				tokens: [{ id: 1, name: 'a', value: '#000' }],
				groups: []
			}
		});
		color.delete_token(spec, 99);
		expect(spec.color.tokens.map((t) => t.id)).toEqual([1]);
		expect(validate(spec).errors).toEqual([]);
	});

	it('does not touch theme.general or theme.spacing', () => {
		const spec = make_spec({
			color: {
				palettes: [],
				tokens: [{ id: 1, name: 'a', value: '#000' }],
				groups: []
			},
			general: {
				tokens: [{ id: 1, name: 'g', value: '4px' }],
				groups: []
			},
			spacing: { scale: [{ id: 1, name: 's', value: '8px' }] },
			themes: [
				{
					id: 1,
					name: 'dark',
					tokens: [{ tokenId: 1, value: '#111' }],
					spacing: [{ tokenId: 1, value: '2px' }],
					general: [{ tokenId: 1, value: '2px' }]
				}
			]
		});
		color.delete_token(spec, 1);
		expect(spec.themes[0].tokens).toEqual([]);
		expect(spec.themes[0].spacing).toEqual([{ tokenId: 1, value: '2px' }]);
		expect(spec.themes[0].general).toEqual([{ tokenId: 1, value: '2px' }]);
	});
});

describe('color.delete_group', () => {
	it('removes group, all tokens in it, and their theme overrides', () => {
		const spec = make_spec({
			color: {
				palettes: [],
				tokens: [
					{ id: 1, name: 'a', value: '#000' },
					{ id: 2, name: 'b', value: '#fff' },
					{ id: 3, name: 'c', value: '#888' }
				],
				groups: [
					{ id: 1, name: 'g1', tokens: [1, 2] },
					{ id: 2, name: 'g2', tokens: [3] }
				]
			},
			themes: [
				{
					id: 1,
					name: 'dark',
					tokens: [
						{ tokenId: 1, value: '#111' },
						{ tokenId: 2, value: '#222' },
						{ tokenId: 3, value: '#333' }
					],
					spacing: [],
					general: []
				}
			]
		});
		color.delete_group(spec, 1);
		expect(spec.color.groups.map((g) => g.id)).toEqual([2]);
		expect(spec.color.tokens.map((t) => t.id)).toEqual([3]);
		expect(spec.themes[0].tokens).toEqual([{ tokenId: 3, value: '#333' }]);
		expect(validate(spec).errors).toEqual([]);
	});

	it('is a no-op when the group does not exist', () => {
		const spec = make_spec({
			color: {
				palettes: [],
				tokens: [{ id: 1, name: 'a', value: '#000' }],
				groups: [{ id: 1, name: 'g1', tokens: [1] }]
			}
		});
		color.delete_group(spec, 99);
		expect(spec.color.groups).toHaveLength(1);
		expect(spec.color.tokens).toHaveLength(1);
	});
});

describe('general.delete_token', () => {
	it('removes the token, unlinks from groups, drops theme.general overrides', () => {
		const spec = make_spec({
			general: {
				tokens: [
					{ id: 1, name: 'a', value: '4px' },
					{ id: 2, name: 'b', value: '8px' }
				],
				groups: [{ id: 1, name: 'radii', tokens: [1, 2] }]
			},
			themes: [
				{
					id: 1,
					name: 'compact',
					tokens: [],
					spacing: [],
					general: [
						{ tokenId: 1, value: '2px' },
						{ tokenId: 2, value: '6px' }
					]
				}
			]
		});
		general.delete_token(spec, 1);
		expect(spec.general.tokens.map((t) => t.id)).toEqual([2]);
		expect(spec.general.groups[0].tokens).toEqual([2]);
		expect(spec.themes[0].general).toEqual([{ tokenId: 2, value: '6px' }]);
		expect(validate(spec).errors).toEqual([]);
	});
});
