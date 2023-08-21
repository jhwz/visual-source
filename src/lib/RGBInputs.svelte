<script lang="ts">
	import { createEventDispatcher } from 'svelte';
	import { hex_to_rgb, rgb_to_hex } from './colors.js';

	const dispatch = createEventDispatcher<{ change: string }>();

	export let color: string;

	$: rgb = hex_to_rgb(color);

	function validate(idx: number, e: Event) {
		const input = e.currentTarget! as HTMLInputElement;
		if (!/[0-9]+/.test(input.value)) {
			input.value = '';
			return;
		}

		rgb[idx] = Math.min(Math.max(parseInt(input.value), 0), 255);
		dispatch('change', rgb_to_hex(rgb));
	}
</script>

<div>
	{#each rgb as v, i}
		<input value={v} on:change={(e) => validate(i, e)} />
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
	input:first-of-type {
		border-top-left-radius: 5px;
		border-bottom-left-radius: 5px;
	}
	input:last-of-type {
		border-top-right-radius: 5px;
		border-bottom-right-radius: 5px;
	}
</style>
