import { invoke } from '@tauri-apps/api/core';
import { environment } from './environment/index.js';
import { generate_css } from './generate/css.js';
import { generate_json } from './generate/json.js';
import { resolve_ref, type $RefType } from './reftype.js';

type $Ref = $RefType<Spec>;

export type Spec = {
	version: 1;
	color: {
		palettes: Palette[];
		tokens: Token[];
		groups: TokenGroup[];
	};
	spacing: {
		scale: Token[];
	};
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
	version: 1,
	color: {
		palettes: [],
		tokens: [],
		groups: []
	},
	spacing: { scale: [] }
});

// Can't use top level await because of webkit bug. See
// https://github.com/tauri-apps/tauri/discussions/9795.
if (environment === 'tauri') {
	invoke<string>('get').then((str) => {
		const spec2: Spec = JSON.parse(str);
		if (spec2.version !== 1) {
			return;
		}
		spec2.color ||= {} as Spec['color'];
		spec2.color.palettes ||= [];
		spec2.color.tokens ||= [];
		spec2.color.groups ||= [];

		spec2.spacing ||= { scale: [] };
		spec2.spacing.scale ||= [];

		Object.assign(spec, spec2);

		write_spec_outputs();

		$effect.root(() => {
			$effect(() => {
				write_spec_outputs();
			});
		});
	});
}

export async function write_spec_outputs() {
	await invoke('write', {
		filename: 'manifest.json',
		data: JSON.stringify(spec)
	});
	await invoke('write', { filename: 'visual-source.css', data: generate_css(spec) });
	await invoke('write', { filename: 'visual-source.json', data: generate_json(spec) });
}

export function token_value(token: Token, specification?: Spec): string {
	if (token.value) return token.value;
	if (!token.$ref) throw new Error('Token has no value or reference');
	return resolve_ref(specification || spec, token.$ref) as string;
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

export function resolved_spec(spec: Spec): ResolvedSpec {
	function resolved_token(t: Token): ResolvedToken {
		return { id: t.id, name: t.name, value: token_value(t, spec) };
	}

	const colorTokens = spec.color.tokens.map(resolved_token);
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
		spacing: { scale: spec.spacing.scale.map(resolved_token) }
	};
}
