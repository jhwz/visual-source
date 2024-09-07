<script lang="ts">
	import { hex_to_rgb, rgb_to_hex } from './colors.js';

	type Props = {
		color: string;
		onchange: (s: string) => void;
	};

	let { color, onchange }: Props = $props();

	let rgb = $derived(hex_to_rgb(color));

	function validate(idx: number, e: Event) {
		const input = e.currentTarget! as HTMLInputElement;
		if (!/[0-9]+/.test(input.value)) {
			input.value = '';
			return;
		}

		rgb[idx] = Math.min(Math.max(parseInt(input.value), 0), 255);
		onchange(rgb_to_hex(rgb));
	}
</script>

<div>
	{#each rgb as v, i}
		<input value={v} onchange={(e) => validate(i, e)} />
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
