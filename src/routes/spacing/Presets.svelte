<script lang="ts">
	import { tailwindSpacing } from '$lib/data/spacing';
	import { spec } from '$lib/spec.svelte.js';
	import { next_id } from '$lib/utils';

	type Props = {};
	let {}: Props = $props();
</script>

<choose-preset-grid>
	<button
		onclick={() => {
			for (const t of tailwindSpacing) {
				spec.spacing.scale.push({
					...t,
					id: next_id(spec.spacing.scale)
				});
			}
		}}
	>
		Tailwind
	</button>
</choose-preset-grid>

<style>
	choose-preset-grid {
		display: grid;
	}
</style>
