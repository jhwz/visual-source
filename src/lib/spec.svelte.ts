import { storage } from './environment/index.js';
import { generate_css } from './generate/css.js';
import { generate_json } from './generate/json.js';
import { resolve_ref, type $RefType } from './reftype.js';

type $Ref = $RefType<Spec>;

export type Spec = {
	version: 2;
	color: {
		palettes: Palette[];
		tokens: Token[];
		groups: TokenGroup[];
	};
	spacing: {
		scale: Token[];
	};
	themes: Theme[];
};

export type Theme = {
	id: number;
	name: string;
	tokens: ThemeTokenOverride[];
	spacing: ThemeTokenOverride[];
};

export type ThemeTokenOverride = {
	tokenId: number;
	value?: string;
	$ref?: $Ref;
};

export type TokenGroup = {
	id: number;
	name: string;
	description?: string;
	tokens: number[];
	css?: {
		prefix?: string;
	};
};

export type Token = {
	id: number;
	name: string;
	description?: string;
	value?: string;
	$ref?: $Ref;

	css?: {
		name?: string;
	};
};

export type Palette = {
	id: number;
	name: string;
	colors: string[];
};

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

export function token_value(token: Token, specification?: Spec): string {
	if (token.value) return token.value;
	if (!token.$ref) throw new Error('Token has no value or reference');
	return resolve_ref(specification || spec, token.$ref) as string;
}

export function themed_token_value(
	token: Token,
	overrides: ThemeTokenOverride[] | null,
	specification?: Spec
): string {
	if (overrides) {
		const override = overrides.find((o) => o.tokenId === token.id);
		if (override) {
			if (override.value) return override.value;
			if (override.$ref)
				return resolve_ref(specification || spec, override.$ref) as string;
		}
	}
	return token_value(token, specification);
}

type ResolvedToken = Omit<Token, '$ref' | 'value'> & {
	value: string;
};

type ResolvedTokenGroup = Omit<TokenGroup, 'tokens'> & {
	tokens: ResolvedToken[];
};

export type ResolvedSpec = {
	color: {
		palettes: Palette[];
		tokens: ResolvedToken[];
		groups: ResolvedTokenGroup[];
	};
	spacing: {
		scale: ResolvedToken[];
	};
};

export function resolved_spec(spec: Spec, theme?: Theme | null): ResolvedSpec {
	function resolved_with(overrides: ThemeTokenOverride[] | null) {
		return (t: Token): ResolvedToken => ({
			id: t.id,
			name: t.name,
			value: themed_token_value(t, overrides, spec)
		});
	}

	const colorTokens = spec.color.tokens.map(resolved_with(theme?.tokens ?? null));
	return {
		color: {
			palettes: spec.color.palettes,
			tokens: colorTokens,
			groups: spec.color.groups.map(
				(g): ResolvedTokenGroup => ({
					...g,
					tokens: g.tokens.map((id) => colorTokens.find((t) => t.id === id)!)
				})
			)
		},
		spacing: { scale: spec.spacing.scale.map(resolved_with(theme?.spacing ?? null)) }
	};
}
