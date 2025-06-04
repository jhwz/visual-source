import type { Spec } from '$lib/spec.svelte';

export function build_groups(spec: Spec) {
	const ungrouped = spec.tokens.filter((t) =>
		spec.token_groups.every((g) => !g.tokens.includes(t.id))
	);
	return [
		{ name: '', tokens: ungrouped },
		...spec.token_groups.map((g) => ({
			...g,
			tokens: g.tokens.map((id) => spec.tokens.find((t) => t.id === id)!)
		}))
	];
}

export type BuiltTokenGroup = ReturnType<typeof build_groups>[number];
