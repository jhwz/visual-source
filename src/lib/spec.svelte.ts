import { invoke } from '@tauri-apps/api/core';
import { environment } from './environment/index.js';
import { generate_css } from './generate/css.js';
import { generate_json } from './generate/json.js';
import { resolve_ref, type $RefType } from './reftype.js';

type $Ref = $RefType<Spec>;

export type Spec = {
	palettes: Palette[];
	tokens: Token[];
	token_groups: TokenGroup[];
	spacing: {
		scale: Token[];
	};
};

export type TokenGroup = {
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
	name: string;
	colors: string[];
};

export const spec: Spec = $state({
	palettes: [],
	tokens: [],
	token_groups: [],
	spacing: { scale: [] }
});

// Can't use top level await because of webkit bug. See
// https://github.com/tauri-apps/tauri/discussions/9795.
if (environment === 'tauri') {
	invoke<string>('get').then((str) => {
		const spec2: Spec = JSON.parse(str);
		spec2.palettes ||= [];
		spec2.tokens ||= [];
		spec2.token_groups ||= [];
		spec2.spacing ||= { scale: [] };
		spec2.spacing.scale ||= [];
		Object.assign(spec, spec2);

		$effect.root(() => {
			$effect(() => {
				write_spec_outputs();
			});
		});
	});
}

export async function write_spec_outputs() {
	console.log('writing outputs');
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

type ResolvedToken = Omit<Token, '$ref' | 'value' | 'id'> & {
	value: string;
};

export type ResolvedSpec = {
	palettes: Palette[];
	tokens: ResolvedToken[];
	spacing: {
		scale: ResolvedToken[];
	};
};

export function resolved_spec(spec: Spec): ResolvedSpec {
	const tokens = spec.tokens.map((token): ResolvedToken => {
		return { name: token.name, value: token_value(token, spec) };
	});
	const spacingTokens = spec.tokens.map((t) => ({ name: t.name, value: token_value(t, spec) }));
	return { palettes: spec.palettes, tokens, spacing: { scale: spacingTokens } };
}
