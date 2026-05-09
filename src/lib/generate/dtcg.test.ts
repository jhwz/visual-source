import { describe, it, expect, vi } from 'vitest';

vi.mock('$lib/environment/index.js', () => ({
	environment: 'browser',
	storage: { load_manifest: async () => null, write_outputs: async () => {} }
}));

import { generate_dtcg } from './dtcg';
import type { Spec } from '$lib/spec.svelte';

function make_spec(overrides?: Partial<Spec>): Spec {
	return {
		version: 2,
		color: { palettes: [], tokens: [], groups: [] },
		spacing: { scale: [] },
		general: { tokens: [], groups: [] },
		themes: [],
		...overrides
	} as Spec;
}

describe('generate_dtcg', () => {
	it('emits palettes under color.palettes with $type color', () => {
		const spec = make_spec({
			color: {
				palettes: [{ id: 1, name: 'Neutral', colors: ['#fbfdff', '#eff4fa', '#e2e8ef'] }],
				tokens: [],
				groups: []
			}
		});
		const out = JSON.parse(generate_dtcg(spec));
		expect(out.color.palettes.neutral['01']).toEqual({ $type: 'color', $value: '#fbfdff' });
		expect(out.color.palettes.neutral['02']).toEqual({ $type: 'color', $value: '#eff4fa' });
		expect(out.color.palettes.neutral['03']).toEqual({ $type: 'color', $value: '#e2e8ef' });
	});

	it('emits color tokens with literal values and resolves $refs to DTCG references', () => {
		const spec = make_spec({
			color: {
				palettes: [{ id: 1, name: 'Neutral', colors: ['#fbfdff', '#000000'] }],
				tokens: [
					{ id: 1, name: 'Background', $ref: '#/color/palettes/1/colors/0' },
					{ id: 2, name: 'Text', value: '#111111', description: 'body text' }
				],
				groups: [{ id: 1, name: 'Surface', tokens: [1, 2] }]
			}
		});
		const out = JSON.parse(generate_dtcg(spec));
		expect(out.color.surface.background).toEqual({
			$type: 'color',
			$value: '{color.palettes.neutral.01}'
		});
		expect(out.color.surface.text).toEqual({
			$type: 'color',
			$value: '#111111',
			$description: 'body text'
		});
	});

	it('emits ungrouped color tokens at the color section root', () => {
		const spec = make_spec({
			color: {
				palettes: [],
				tokens: [{ id: 1, name: 'Brand', value: '#ff0000' }],
				groups: []
			}
		});
		const out = JSON.parse(generate_dtcg(spec));
		expect(out.color.brand).toEqual({ $type: 'color', $value: '#ff0000' });
	});

	it('emits spacing as a flat object with $type dimension', () => {
		const spec = make_spec({
			spacing: {
				scale: [
					{ id: 1, name: 'sp-01', value: '4px' },
					{ id: 2, name: 'sp-02', value: '8px' }
				]
			}
		});
		const out = JSON.parse(generate_dtcg(spec));
		expect(out.spacing['sp-01']).toEqual({ $type: 'dimension', $value: '4px' });
		expect(out.spacing['sp-02']).toEqual({ $type: 'dimension', $value: '8px' });
	});

	it('emits general tokens with no $type, grouped same as color', () => {
		const spec = make_spec({
			general: {
				tokens: [
					{ id: 1, name: 'Radius SM', value: '4px' },
					{ id: 2, name: 'Header Height', value: '64px' }
				],
				groups: [{ id: 1, name: 'Radii', tokens: [1] }]
			}
		});
		const out = JSON.parse(generate_dtcg(spec));
		expect(out.general.radii['radius-sm']).toEqual({ $value: '4px' });
		expect(out.general['header-height']).toEqual({ $value: '64px' });
		// No $type for general tokens.
		expect(out.general.radii['radius-sm'].$type).toBeUndefined();
	});

	it('emits themes under $extensions["com.visualsource.themes"]', () => {
		const spec = make_spec({
			color: {
				palettes: [{ id: 1, name: 'Neutral', colors: ['#fff', '#000'] }],
				tokens: [
					{ id: 1, name: 'Background', value: '#ffffff' },
					{ id: 2, name: 'Border', value: '#cccccc' }
				],
				groups: [{ id: 1, name: 'Surface', tokens: [1] }]
			},
			spacing: { scale: [{ id: 1, name: 'Small', value: '4px' }] },
			general: {
				tokens: [{ id: 1, name: 'Radius', value: '4px' }],
				groups: []
			},
			themes: [
				{
					id: 1,
					name: 'Dark',
					tokens: [
						{ tokenId: 1, value: '#000000' },
						{ tokenId: 2, $ref: '#/color/palettes/1/colors/1' as any }
					],
					spacing: [{ tokenId: 1, value: '2px' }],
					general: [{ tokenId: 1, value: '8px' }]
				}
			]
		});
		const out = JSON.parse(generate_dtcg(spec));
		const dark = out.$extensions['com.visualsource.themes'].Dark;
		// Color override under group
		expect(dark.color.surface.background).toEqual({ $value: '#000000' });
		// Color override ungrouped, $ref form
		expect(dark.color.border).toEqual({ $value: '{color.palettes.neutral.02}' });
		// Spacing override
		expect(dark.spacing.small).toEqual({ $value: '2px' });
		// General override
		expect(dark.general.radius).toEqual({ $value: '8px' });
	});

	it('omits $extensions when there are no themes', () => {
		const spec = make_spec({
			color: { palettes: [], tokens: [{ id: 1, name: 'X', value: '#fff' }], groups: [] }
		});
		const out = JSON.parse(generate_dtcg(spec));
		expect(out.$extensions).toBeUndefined();
	});

	it('omits empty top-level sections', () => {
		const out = JSON.parse(generate_dtcg(make_spec()));
		expect(out.color).toBeUndefined();
		expect(out.spacing).toBeUndefined();
		expect(out.general).toBeUndefined();
		expect(out.$extensions).toBeUndefined();
	});

	it('produces valid JSON', () => {
		const spec = make_spec({
			color: {
				palettes: [{ id: 1, name: 'Neutral', colors: ['#fff', '#000'] }],
				tokens: [{ id: 1, name: 'Bg', $ref: '#/color/palettes/1/colors/0' }],
				groups: [{ id: 1, name: 'Surface', tokens: [1] }]
			}
		});
		expect(() => JSON.parse(generate_dtcg(spec))).not.toThrow();
	});
});
