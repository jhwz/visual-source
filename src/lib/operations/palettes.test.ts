import { describe, expect, it } from 'vitest';
import type { Spec } from '../spec.js';
import { make_spec } from '../test-helpers.js';
import { validate } from '../validate.js';
import { palettes } from './index.js';

function fixture(): Spec {
	return make_spec({
		color: {
			palettes: [
				{ id: 1, name: 'Blue', colors: ['#001f3f', '#0074d9', '#7fdbff'] },
				{ id: 2, name: 'Red', colors: ['#85144b', '#ff4136', '#ffb6b6'] }
			],
			tokens: [
				{ id: 1, name: 'bg', $ref: '#/color/palettes/1/colors/0' },
				{ id: 2, name: 'accent', $ref: '#/color/palettes/2/colors/1' },
				{ id: 3, name: 'border', value: '#cccccc' }
			],
			groups: []
		},
		themes: [
			{
				id: 1,
				name: 'dark',
				tokens: [
					{ tokenId: 1, $ref: '#/color/palettes/1/colors/2' },
					{ tokenId: 3, value: '#222222' }
				],
				spacing: [],
				general: []
			}
		]
	});
}

describe('palettes.delete_palette', () => {
	it('materializes $refs in color tokens that pointed at it', () => {
		const spec = fixture();
		palettes.delete_palette(spec, 1);

		const bg = spec.color.tokens.find((t) => t.id === 1)!;
		expect(bg.$ref).toBeUndefined();
		expect(bg.value).toBe('#001f3f');

		// Tokens referencing the other palette are untouched.
		const accent = spec.color.tokens.find((t) => t.id === 2)!;
		expect(accent.$ref).toBe('#/color/palettes/2/colors/1');

		expect(spec.color.palettes.map((p) => p.id)).toEqual([2]);
		expect(validate(spec).errors).toEqual([]);
	});

	it('materializes $refs in theme overrides that pointed at it', () => {
		const spec = fixture();
		palettes.delete_palette(spec, 1);

		const override = spec.themes[0].tokens.find((o) => o.tokenId === 1)!;
		expect(override.$ref).toBeUndefined();
		expect(override.value).toBe('#7fdbff');

		expect(validate(spec).errors).toEqual([]);
	});

	it('is a no-op when the palette does not exist', () => {
		const spec = fixture();
		const before = JSON.stringify(spec);
		palettes.delete_palette(spec, 99);
		expect(JSON.stringify(spec)).toBe(before);
	});
});

describe('palettes.delete_color', () => {
	it('materializes a $ref pointing at the removed color', () => {
		const spec = fixture();
		palettes.delete_color(spec, 1, 0); // removes Blue[0] = '#001f3f'

		const bg = spec.color.tokens.find((t) => t.id === 1)!;
		expect(bg.$ref).toBeUndefined();
		expect(bg.value).toBe('#001f3f');

		// Palette now has the remaining two colors.
		expect(spec.color.palettes.find((p) => p.id === 1)!.colors).toEqual(['#0074d9', '#7fdbff']);

		expect(validate(spec).errors).toEqual([]);
	});

	it('reindexes $refs that pointed past the removed color', () => {
		const spec = fixture();
		// theme override points at Blue[2]; removing Blue[0] should shift it to Blue[1].
		palettes.delete_color(spec, 1, 0);

		const override = spec.themes[0].tokens.find((o) => o.tokenId === 1)!;
		expect(override.$ref).toBe('#/color/palettes/1/colors/1');
		expect(override.value).toBeUndefined();

		expect(validate(spec).errors).toEqual([]);
	});

	it('leaves $refs to other palettes alone', () => {
		const spec = fixture();
		palettes.delete_color(spec, 1, 0);

		const accent = spec.color.tokens.find((t) => t.id === 2)!;
		expect(accent.$ref).toBe('#/color/palettes/2/colors/1');
	});

	it('is a no-op when index is out of range', () => {
		const spec = fixture();
		const before = JSON.stringify(spec);
		palettes.delete_color(spec, 1, 99);
		expect(JSON.stringify(spec)).toBe(before);
	});
});

describe('palettes.move_color', () => {
	it('rewrites a $ref pointing at the moved color (forward move)', () => {
		const spec = fixture();
		// Move Blue[0] to Blue[2]. The bg token pointing at Blue[0] should follow.
		palettes.move_color(spec, 1, 0, 2);

		const bg = spec.color.tokens.find((t) => t.id === 1)!;
		expect(bg.$ref).toBe('#/color/palettes/1/colors/2');
		expect(spec.color.palettes.find((p) => p.id === 1)!.colors).toEqual([
			'#0074d9',
			'#7fdbff',
			'#001f3f'
		]);
		expect(validate(spec).errors).toEqual([]);
	});

	it('shifts $refs displaced by a forward move', () => {
		const spec = fixture();
		// Move Blue[0] to Blue[2]. The theme override at Blue[2] should shift to Blue[1].
		palettes.move_color(spec, 1, 0, 2);

		const override = spec.themes[0].tokens.find((o) => o.tokenId === 1)!;
		expect(override.$ref).toBe('#/color/palettes/1/colors/1');
		expect(validate(spec).errors).toEqual([]);
	});

	it('rewrites a $ref pointing at the moved color (backward move)', () => {
		const spec = fixture();
		// Move Blue[2] to Blue[0]. The theme override at Blue[2] should follow.
		palettes.move_color(spec, 1, 2, 0);

		const override = spec.themes[0].tokens.find((o) => o.tokenId === 1)!;
		expect(override.$ref).toBe('#/color/palettes/1/colors/0');
		expect(spec.color.palettes.find((p) => p.id === 1)!.colors).toEqual([
			'#7fdbff',
			'#001f3f',
			'#0074d9'
		]);
		expect(validate(spec).errors).toEqual([]);
	});

	it('shifts $refs displaced by a backward move', () => {
		const spec = fixture();
		// Move Blue[2] to Blue[0]. The bg token at Blue[0] should shift to Blue[1].
		palettes.move_color(spec, 1, 2, 0);

		const bg = spec.color.tokens.find((t) => t.id === 1)!;
		expect(bg.$ref).toBe('#/color/palettes/1/colors/1');
		expect(validate(spec).errors).toEqual([]);
	});

	it('is a no-op when from == to', () => {
		const spec = fixture();
		const before = JSON.stringify(spec);
		palettes.move_color(spec, 1, 1, 1);
		expect(JSON.stringify(spec)).toBe(before);
	});
});
