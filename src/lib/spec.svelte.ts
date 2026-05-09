import { storage } from './environment/index.js';
import { generate_css } from './generate/css.js';
import { generate_json } from './generate/json.js';
import * as pure from './spec.js';
import type { Spec, Theme, ThemeTokenOverride, Token } from './spec.js';

export type { Spec, Theme, ThemeTokenOverride, TokenGroup, Token, Palette, ResolvedSpec } from './spec.js';

export const spec: Spec = $state({
	version: 2,
	color: {
		palettes: [],
		tokens: [],
		groups: []
	},
	spacing: { scale: [] },
	themes: []
});

// Can't use top level await because of webkit bug. See
// https://github.com/tauri-apps/tauri/discussions/9795.
storage.load_manifest().then((str) => {
	if (str) {
		const spec2 = JSON.parse(str);
		if (spec2.version === 1) {
			spec2.version = 2;
			spec2.themes = [];
		}
		if (spec2.version === 2) {
			spec2.color ||= {} as Spec['color'];
			spec2.color.palettes ||= [];
			spec2.color.tokens ||= [];
			spec2.color.groups ||= [];

			spec2.spacing ||= { scale: [] };
			spec2.spacing.scale ||= [];
			spec2.themes ||= [];

			Object.assign(spec, spec2);
		}
	}

	write_spec_outputs();

	$effect.root(() => {
		$effect(() => {
			write_spec_outputs();
		});
	});
});

export async function write_spec_outputs() {
	await storage.write_outputs({
		manifest: JSON.stringify(spec),
		css: generate_css(spec),
		json: generate_json(spec)
	});
}

export function token_value(token: Token, specification: Spec = spec): string {
	return pure.token_value(token, specification);
}

export function themed_token_value(
	token: Token,
	overrides: ThemeTokenOverride[] | null,
	specification: Spec = spec
): string {
	return pure.themed_token_value(token, overrides, specification);
}

export function resolved_spec(specification: Spec = spec, theme?: Theme | null) {
	return pure.resolved_spec(specification, theme);
}
