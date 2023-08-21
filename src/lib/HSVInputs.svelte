<script lang="ts">
	import { createEventDispatcher } from 'svelte';
	import { hex_to_rgb, rgb_to_hex, rgb_to_hsv } from './colors.js';

	const dispatch = createEventDispatcher<{ change: string }>();

	export let color: string;

	$: hsv = rgb_to_hsv(hex_to_rgb(color));
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
		background-color: #3d3d44;
		color: #fff;
		padding: var(--sp-0p5) var(--sp-01);
		max-width: 4rem;
	}
	input:read-only {
		color: #ccc;
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
