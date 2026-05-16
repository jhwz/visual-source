import type { Spec } from './spec.js';

/**
 * Minimal valid Spec for tests. Pass `overrides` to replace any top-level
 * section; nested fields are not merged.
 */
export function make_spec(overrides?: Partial<Spec>): Spec {
	return {
		version: 2,
		color: {
			palettes: [],
			tokens: [],
			groups: []
		},
		spacing: { scale: [] },
		general: { tokens: [], groups: [] },
		themes: [],
		...overrides
	} as Spec;
}
