import type { Spec } from '$lib/spec.svelte';

export function build_groups(spec: Spec) {
	const ungrouped = spec.color.tokens.filter((t) =>
		spec.color.groups.every((g) => !g.tokens.includes(t.id))
	);
	return [
		{ id: 0, name: '', tokens: ungrouped },
		...spec.color.groups.map((g) => ({
			...g,
			tokens: g.tokens.map((id) => spec.color.tokens.find((t) => t.id === id)!)
		}))
	];
}

export type BuiltTokenGroup = ReturnType<typeof build_groups>[number];
