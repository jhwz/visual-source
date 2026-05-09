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

export function token_value(token: Token, spec: Spec): string {
	if (token.value) return token.value;
	if (!token.$ref) throw new Error('Token has no value or reference');
	return resolve_ref(spec, token.$ref) as string;
}

export function themed_token_value(
	token: Token,
	overrides: ThemeTokenOverride[] | null,
	spec: Spec
): string {
	if (overrides) {
		const override = overrides.find((o) => o.tokenId === token.id);
		if (override) {
			if (override.value) return override.value;
			if (override.$ref) return resolve_ref(spec, override.$ref) as string;
		}
	}
	return token_value(token, spec);
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
