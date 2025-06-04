<script lang="ts">
	import { hex_to_rgb, rgb_to_hsv } from './colors.js';

	type Props = {
		color: string;
	};

	let { color }: Props = $props();

	let hsv = $derived(rgb_to_hsv(hex_to_rgb(color)));
</script>

<div>
	{#each hsv as v, i}
		<input value={Math.round(i == 0 ? v * 360 : v * 100)} readonly />
	{/each}
</div>

<style>
	div {
		display: flex;
		gap: var(--sp-01);
	}
	input {
		flex: 1;
		width: 0;
		border: none;
		padding: var(--sp-0p5) var(--sp-01);
		max-width: 4rem;
	}
	input:first-of-type {
		border-top-left-radius: 5px;
		border-bottom-left-radius: 5px;
	}
	input:last-of-type {
		border-top-right-radius: 5px;
		border-bottom-right-radius: 5px;
	}
</style>
