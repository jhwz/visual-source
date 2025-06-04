<script lang="ts">
	import { tailwindSpacing } from '$lib/data/spacing';
	import { spec } from '$lib/spec.svelte.js';

	type Props = {};
	let {}: Props = $props();
</script>

<choose-preset-grid>
	<button
		onclick={() => {
			spec.spacing.scale = tailwindSpacing;
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
