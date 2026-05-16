import { describe, expect, it, vi } from 'vitest';
import { build_groups } from '../routes/color-tokens/color_tokens';
import { move_token } from './move';
import type { Spec } from './spec';

vi.mock('./environment/index.js', () => ({
	environment: 'browser',
	storage: { load_manifest: async () => null, write_outputs: async () => {} }
}));

describe('move_token', () => {
	it('moves a token between groups', () => {
		const groups = [
			{ tokens: [{ id: 1 }, { id: 2 }] },
			{ tokens: [{ id: 3 }] }
		];
		expect(move_token(groups, 1, 1)).toBe(true);
		expect(groups[0].tokens.map((t) => t.id)).toEqual([2]);
		expect(groups[1].tokens.map((t) => t.id)).toEqual([3, 1]);
	});

	it('inserts at the requested position', () => {
		const groups = [{ tokens: [{ id: 1 }] }, { tokens: [{ id: 2 }, { id: 3 }] }];
		move_token(groups, 1, 1, 1);
		expect(groups[1].tokens.map((t) => t.id)).toEqual([2, 1, 3]);
	});

	it('returns false when the token is not found', () => {
		const groups = [{ tokens: [{ id: 1 }] }];
		expect(move_token(groups, 99, 0)).toBe(false);
		expect(groups[0].tokens.map((t) => t.id)).toEqual([1]);
	});

	it('returns false when the target index is out of bounds', () => {
		const groups = [{ tokens: [{ id: 1 }] }];
		expect(move_token(groups, 1, 5)).toBe(false);
		expect(groups[0].tokens.map((t) => t.id)).toEqual([1]);
	});
});

// Mirrors what TokensPage does for drag-drop: build_groups → mutate built groups
// → sync back to spec via the same shape used by routes/+page.svelte. Guards
// against the previous bug where remove_token() ran during drag-drop and wiped
// theme overrides for the moved token.
describe('moving a color token preserves theme overrides', () => {
	function make_spec(): Spec {
		return {
			version: 2,
			color: {
				palettes: [],
				tokens: [
					{ id: 1, name: 'primary', value: '#000000' },
					{ id: 2, name: 'secondary', value: '#ffffff' }
				],
				groups: [
					{ id: 1, name: 'a', tokens: [1] },
					{ id: 2, name: 'b', tokens: [2] }
				]
			},
			spacing: { scale: [] },
			general: { tokens: [], groups: [] },
			themes: [
				{
					id: 1,
					name: 'dark',
					tokens: [{ tokenId: 1, value: '#111111' }],
					spacing: [],
					general: []
				}
			]
		};
	}

	function sync_back(spec: Spec, builtGroups: ReturnType<typeof build_groups>) {
		spec.color.tokens = builtGroups.flatMap((g) => g.tokens);
		spec.color.groups = builtGroups
			.slice(1)
			.map((g) => ({ ...g, tokens: g.tokens.map((t) => t.id) }));
	}

	it('survives a move between two groups', () => {
		const spec = make_spec();
		const built = build_groups(spec);
		const targetIndex = built.findIndex((g) => g.id === 2);

		move_token(built, 1, targetIndex);
		sync_back(spec, built);

		expect(spec.color.groups.find((g) => g.name === 'b')!.tokens).toContain(1);
		expect(spec.color.groups.find((g) => g.name === 'a')!.tokens).not.toContain(1);
		expect(spec.themes[0].tokens).toEqual([{ tokenId: 1, value: '#111111' }]);
	});

	it('survives a move to the ungrouped section', () => {
		const spec = make_spec();
		const built = build_groups(spec);

		move_token(built, 1, 0); // index 0 is the virtual ungrouped group
		sync_back(spec, built);

		expect(spec.color.groups.every((g) => !g.tokens.includes(1))).toBe(true);
		expect(spec.color.tokens.some((t) => t.id === 1)).toBe(true);
		expect(spec.themes[0].tokens).toEqual([{ tokenId: 1, value: '#111111' }]);
	});
});
