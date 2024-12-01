import { invoke } from '@tauri-apps/api/core';
import { writeTextFile } from '@tauri-apps/plugin-fs';
import { generate_css } from './generate/css.js';
import { resolve_ref, type $RefType } from './reftype.js';

type $Ref = $RefType<Spec>;

export type Spec = {
	palettes: Palette[];
	tokens: Token[];
	outputs?: PaletteOutput;
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

type PaletteOutput = {
	css?: {
		filename: string;
	};
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
		write_spec_outputs();
	});
});

export async function write_spec_outputs() {
	if (spec.outputs?.css?.filename) {
		await writeTextFile(spec.outputs.css.filename, generate_css(spec));
	}
}

export function token_value(token: Token): string {
	if (token.value) return token.value;
	if (!token.$ref) throw new Error('Token has no value or reference');
	return resolve_ref(spec, token.$ref) as string;
}
