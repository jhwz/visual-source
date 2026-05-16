import { describe, expect, it } from 'vitest';
import { make_spec } from '../test-helpers.js';
import { validate } from '../validate.js';
import { themes } from './index.js';

describe('themes.delete_theme', () => {
	it('removes the theme', () => {
		const spec = make_spec({
			themes: [
				{ id: 1, name: 'a', tokens: [], spacing: [], general: [] },
				{ id: 2, name: 'b', tokens: [], spacing: [], general: [] }
			]
		});
		themes.delete_theme(spec, 1);
		expect(spec.themes.map((t) => t.id)).toEqual([2]);
		expect(validate(spec).errors).toEqual([]);
	});

	it('is a no-op when the theme does not exist', () => {
		const spec = make_spec({
			themes: [{ id: 1, name: 'a', tokens: [], spacing: [], general: [] }]
		});
		themes.delete_theme(spec, 99);
		expect(spec.themes.length).toBe(1);
	});
});

describe('themes.set_override', () => {
	it('pushes a new override when none exists', () => {
		const spec = make_spec({
			color: {
				palettes: [],
				tokens: [{ id: 1, name: 'a', value: '#000' }],
				groups: []
			},
			themes: [{ id: 1, name: 'dark', tokens: [], spacing: [], general: [] }]
		});
		themes.set_override(spec, 1, 'color', 1, { value: '#111' });
		expect(spec.themes[0].tokens).toEqual([{ tokenId: 1, value: '#111', $ref: undefined }]);
		expect(validate(spec).errors).toEqual([]);
	});

	it('updates an existing override in place (idempotent)', () => {
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
		themes.set_override(spec, 1, 'color', 1, { value: '#222' });
		expect(spec.themes[0].tokens).toHaveLength(1);
		expect(spec.themes[0].tokens[0].value).toBe('#222');
	});

	it('handles spacing section', () => {
		const spec = make_spec({
			spacing: { scale: [{ id: 1, name: 'sm', value: '4px' }] },
			themes: [{ id: 1, name: 'compact', tokens: [], spacing: [], general: [] }]
		});
		themes.set_override(spec, 1, 'spacing', 1, { value: '2px' });
		expect(spec.themes[0].spacing).toHaveLength(1);
		expect(spec.themes[0].spacing[0]).toEqual({ tokenId: 1, value: '2px', $ref: undefined });
	});

	it('handles general section', () => {
		const spec = make_spec({
			general: {
				tokens: [{ id: 1, name: 'r', value: '4px' }],
				groups: []
			},
			themes: [{ id: 1, name: 'compact', tokens: [], spacing: [], general: [] }]
		});
		themes.set_override(spec, 1, 'general', 1, { value: '2px' });
		expect(spec.themes[0].general).toHaveLength(1);
	});

	it('is a no-op when the theme does not exist', () => {
		const spec = make_spec({});
		themes.set_override(spec, 99, 'color', 1, { value: '#111' });
		expect(spec.themes).toEqual([]);
	});
});

describe('themes.clear_override', () => {
	it('removes the override entry', () => {
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
		themes.clear_override(spec, 1, 'color', 1);
		expect(spec.themes[0].tokens).toEqual([]);
		expect(validate(spec).errors).toEqual([]);
	});

	it('is a no-op when the override does not exist', () => {
		const spec = make_spec({
			themes: [{ id: 1, name: 'dark', tokens: [], spacing: [], general: [] }]
		});
		themes.clear_override(spec, 1, 'color', 99);
		expect(spec.themes[0].tokens).toEqual([]);
	});
});
