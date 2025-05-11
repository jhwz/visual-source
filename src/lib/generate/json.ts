import { resolved_spec, type Spec } from '$lib/spec.svelte';

export function generate_json(spec: Spec) {
	return JSON.stringify(resolved_spec(spec));
}
