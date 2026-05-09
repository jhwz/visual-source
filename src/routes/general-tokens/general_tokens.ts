import type { Spec } from '$lib/spec.svelte';

export function build_groups(spec: Spec) {
	const tokens = spec.general?.tokens ?? [];
	const groups = spec.general?.groups ?? [];
	const ungrouped = tokens.filter((t) => groups.every((g) => !g.tokens.includes(t.id)));
	return [
		{ id: 0, name: '', tokens: ungrouped },
		...groups.map((g) => ({
			...g,
			tokens: g.tokens.map((id) => tokens.find((t) => t.id === id)!)
		}))
	];
}

export type BuiltGeneralTokenGroup = ReturnType<typeof build_groups>[number];
