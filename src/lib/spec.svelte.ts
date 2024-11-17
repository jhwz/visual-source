import { invoke } from '@tauri-apps/api/core';
import { resolve_ref, type $RefType } from './reftype.js';

type $Ref = $RefType<Spec>;

export type Spec = {
	palettes: Palette[];
	tokens: Token[];
};

export type Token = {
	name: string;
	value?: string;
	$ref?: $Ref;
};

export type Palette = {
	name: string;
	colors: string[];
};

export const spec: Spec = $state({ palettes: [], tokens: [] });

// Can't use top level await because of webkit bug. See
// https://github.com/tauri-apps/tauri/discussions/9795.
// TODO: eventually switch back to top level await.
invoke<string>('get').then((str) => {
	const spec2 = JSON.parse(str);
	spec.palettes = spec2.palettes || [];
	spec.tokens = spec2.tokens || [];

	// Save the spec anytime it changes
	$effect.root(() => {
		invoke('save', { data: JSON.stringify(spec) });
	});
});

export function token_value(token: Token): string {
	if (token.value) return token.value;
	if (!token.$ref) throw new Error('Token has no value or reference');
	return resolve_ref(spec, token.$ref) as string;
}
