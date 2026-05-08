<script lang="ts">
	import { hex_to_rgb, hsv_to_rgb, rgb_to_hex, rgb_to_hsv } from '$lib/colors.js';

	type Props = {
		color: string;
		prev: string | null;
		next: string | null;
		selected: boolean;
		label: string;
		onchange: (s: string) => void;
		onclick: () => void;
	};

	let { color, selected, label, onchange, onclick, prev, next }: Props = $props();

	let hsv = $state(rgb_to_hsv(hex_to_rgb(color)));
	$effect(() => {
		hsv = rgb_to_hsv(hex_to_rgb(color));
	});

	let width = $state(0);
	let height = $state(0);

	function compute_line(
		start: number | undefined,
		end: number | undefined,
		height: number,
		width: number
	) {
		if (!width || start == null || end == null) return null;
		const x = (end - start) * height;
		const w = width;
		const hyp = Math.sqrt(x ** 2 + w ** 2);
		const angle = Math.asin(x / hyp) * (180 / Math.PI);

		return {
			top: end * 96,
			length: hyp - 10,
			angle
		};
	}
	let prevHSV = $derived(prev ? rgb_to_hsv(hex_to_rgb(prev)) : null);
	let prevLines = $derived(hsv.map((v, i) => compute_line(prevHSV?.[i], v, height, width)));

	let nextHSV = $derived(next ? rgb_to_hsv(hex_to_rgb(next)) : null);
	let nextLines = $derived(hsv.map((v, i) => compute_line(v, nextHSV?.[i], height, width)));

	function pointerdown(e: PointerEvent & { currentTarget: HTMLElement }) {
		onclick();
		e.currentTarget.setPointerCapture(e.pointerId);
	}
	function pointermove(e: PointerEvent & { currentTarget: HTMLElement }) {
		const el = e.currentTarget;
		if (!el.hasPointerCapture(e.pointerId)) return;

		const parent = el.parentElement!;
		const index = [...parent.children].indexOf(el);

		const rect = parent.getBoundingClientRect();
		const y = e.clientY - rect.top;
		hsv[index] = Math.max(0, Math.min(1, y / rect.height));
	}
	function pointerup(e: PointerEvent & { currentTarget: HTMLElement }) {
		e.stopPropagation();
		e.currentTarget.releasePointerCapture(e.pointerId);

		onchange(rgb_to_hex(hsv_to_rgb(hsv)));
	}
</script>

<!-- svelte-ignore a11y_click_events_have_key_events -->
<!-- svelte-ignore a11y_no_static_element_interactions -->
<color-control
	bind:clientWidth={width}
	bind:clientHeight={height}
	class:selected
	data-h={hsv[0]}
	data-s={hsv[1]}
	data-v={hsv[2]}
	style="--color: rgb({hsv_to_rgb(hsv).join(' ')})"
	{onclick}
>
	{#each hsv as v, i}
		{@const typ = i == 0 ? 'h' : i == 1 ? 's' : 'v'}
		<color-handle
			class={typ}
			style="--position: {v * 96}%"
			onpointerdown={pointerdown}
			onpointerup={pointerup}
			onpointermove={pointermove}
		>
			{typ}
		</color-handle>
	{/each}

	{#each prevLines as l}
		{#if l}
			<color-line
				class="prev"
				style="--position: {l.top}%; --length: {l.length}px; --angle: {l.angle}deg"
			>
			</color-line>
		{/if}
	{/each}

	{#each nextLines as l}
		{#if l}
			<color-line
				class="next"
				style="--position: {l.top}%; --length: {l.length}px; --angle: {l.angle + 180}deg"
			>
			</color-line>
		{/if}
	{/each}

	<color-label>{label}</color-label>
</color-control>

<style>
	color-control {
		display: block;
		height: 100%;
		background-color: var(--color);
		flex: 1;
		cursor: default;
		position: relative;
		user-select: none;
		-webkit-user-select: none;
	}
	color-control.selected {
		z-index: 2;
		transform: scaleX(1.01) scaleY(1.01);
		transition: transform 0.15s ease-in-out;
		border-radius: 5px;
	}

	color-control:first-of-type {
		border-top-left-radius: 5px;
		border-bottom-left-radius: 5px;
	}
	color-control:last-of-type {
		border-top-right-radius: 5px;
		border-bottom-right-radius: 5px;
	}

	color-handle {
		display: flex;
		align-items: center;
		justify-content: center;
		font-size: 10px;
		font-family: monospace;
		user-select: none;
		-webkit-user-select: none;

		position: absolute;
		border: 2px solid #000;
		background-color: #fff;
		color: #777;
		width: 24px;
		height: 24px;
		border-radius: 50%;

		z-index: 30;

		top: calc(var(--position) - 12px + 2%);
		left: calc(50% - 12px);

		cursor: grab;
		touch-action: none;
	}
	color-handle:active {
		cursor: grabbing;
	}

	color-label {
		display: flex;
		align-items: center;
		justify-content: center;
		position: absolute;
		left: 0;
		right: 0;
		bottom: -1.75rem;
		font-size: 0.7rem;
		color: var(--bg-text-02);
		font-variant-numeric: tabular-nums;
		pointer-events: none;
	}

	:global(color-line-label) {
		display: flex;
		align-items: center;
		justify-content: center;

		position: absolute;
		transform-origin: left;
		z-index: 40;

		height: 10px;
		width: 10px;

		color: white;
	}
	color-line {
		display: block;
		height: 3px;
		background-color: #000;
		position: absolute;
		z-index: 20;
		top: calc(var(--position) - 1.5px + 2%);
		width: var(--length);
		transform: rotate(var(--angle));
	}
	color-line.prev {
		right: 50%;
		transform-origin: right;
	}
	color-line.next {
		left: 150%;
		transform-origin: left;
	}
</style>
