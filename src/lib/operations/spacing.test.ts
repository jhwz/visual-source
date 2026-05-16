import { describe, expect, it } from 'vitest';
import { make_spec } from '../test-helpers.js';
import { validate } from '../validate.js';
import { spacing } from './index.js';

describe('spacing.delete_token', () => {
	it('removes the token from the scale', () => {
		const spec = make_spec({
			spacing: {
				scale: [
					{ id: 1, name: 'sm', value: '4px' },
					{ id: 2, name: 'md', value: '8px' }
				]
			}
		});
		spacing.delete_token(spec, 1);
		expect(spec.spacing.scale.map((t) => t.id)).toEqual([2]);
		expect(validate(spec).errors).toEqual([]);
	});

	it('drops theme.spacing overrides keyed by the deleted token', () => {
		const spec = make_spec({
			spacing: {
				scale: [
					{ id: 1, name: 'sm', value: '4px' },
					{ id: 2, name: 'md', value: '8px' }
				]
			},
			themes: [
				{
					id: 1,
					name: 'compact',
					tokens: [],
					spacing: [
						{ tokenId: 1, value: '2px' },
						{ tokenId: 2, value: '6px' }
					],
					general: []
				}
			]
		});
		spacing.delete_token(spec, 1);
		expect(spec.themes[0].spacing).toEqual([{ tokenId: 2, value: '6px' }]);
		expect(validate(spec).errors).toEqual([]);
	});

	it('does not touch theme.tokens or theme.general', () => {
		const spec = make_spec({
			spacing: { scale: [{ id: 1, name: 'sm', value: '4px' }] },
			color: {
				palettes: [],
				tokens: [{ id: 1, name: 'a', value: '#000' }],
				groups: []
			},
			general: {
				tokens: [{ id: 1, name: 'r', value: '4px' }],
				groups: []
			},
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
		spacing.delete_token(spec, 1);
		expect(spec.themes[0].spacing).toEqual([]);
		expect(spec.themes[0].tokens).toEqual([{ tokenId: 1, value: '#111' }]);
		expect(spec.themes[0].general).toEqual([{ tokenId: 1, value: '2px' }]);
	});

	it('is a no-op when the token does not exist', () => {
		const spec = make_spec({
			spacing: { scale: [{ id: 1, name: 'sm', value: '4px' }] }
		});
		spacing.delete_token(spec, 99);
		expect(spec.spacing.scale.map((t) => t.id)).toEqual([1]);
		expect(validate(spec).errors).toEqual([]);
	});
});
