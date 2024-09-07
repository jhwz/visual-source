<script lang="ts" module>
	export function redraw_lines() {
		// remove any existing lines
		for (const n of document.querySelectorAll('color-line')) {
			n.remove();
		}

		for (const className of ['h', 's', 'v']) {
			const nodes = [...document.querySelectorAll('color-handle.' + className)];

			for (let i = 0; i < nodes.length - 1; i++) {
				const n1 = nodes[i] as HTMLElement;
				const n2 = nodes[i + 1] as HTMLElement;
				const rect1 = n1.getBoundingClientRect();
				const rect2 = n2.getBoundingClientRect();
				const line = document.createElement('color-line');

				// Find the points based off the elements left and top
				var p1 = { x: rect1.left + rect1.width / 2 - 1, y: rect1.top + rect1.height / 2 - 1 };
				var p2 = { x: rect2.left + rect2.width / 2 - 1, y: rect2.top + rect2.height / 2 - 1 };

				// Get distance between the points for length of line
				var a = p1.x - p2.x;
				var b = p1.y - p2.y;
				var length = Math.sqrt(a * a + b * b);

				// Get angle between points
				var angleDeg = (Math.atan2(p2.y - p1.y, p2.x - p1.x) * 180) / Math.PI;

				// Set line distance and position
				// Add width/height from above so the line starts in the middle instead of the top-left corner
				line.style.width = length + 'px';
				line.style.left = p1.x + 'px';
				line.style.top = p1.y + 'px';

				// Rotate line to match angle between points
				line.style.transform = 'rotate(' + angleDeg + 'deg)';

				document.body.appendChild(line);
			}
		}
	}
</script>

<script lang="ts">
	import { createEventDispatcher } from 'svelte';
	import { hex_to_rgb, hsv_to_rgb, rgb_to_hex, rgb_to_hsv } from './colors.js';

	const dispatch = createEventDispatcher<{ change: string; click: null }>();

	export let color: string;
	export let selected: boolean;
	export let height: number;

	$: hsv = rgb_to_hsv(hex_to_rgb(color));

	function pointerdown(e: PointerEvent & { currentTarget: HTMLElement }) {
		e.currentTarget.setPointerCapture(e.pointerId);
	}
	function pointermove(e: PointerEvent & { currentTarget: HTMLElement }) {
		const el = e.currentTarget;
		if (!el.hasPointerCapture(e.pointerId)) return;

		redraw_lines();

		const parent = el.parentElement!;
		const index = [...parent.children].indexOf(el);

		const rect = parent.getBoundingClientRect();
		const y = e.clientY - rect.top;
		hsv[index] = Math.max(0, Math.min(1, y / rect.height));
	}
	function pointerup(e: PointerEvent & { currentTarget: HTMLElement }) {
		e.stopPropagation();
		e.currentTarget.releasePointerCapture(e.pointerId);
		dispatch('change', rgb_to_hex(hsv_to_rgb(hsv)));
	}

	function onclick(e: MouseEvent) {
		if (!selected) dispatch('click');
		else if (e.currentTarget === e.target) {
			dispatch('click');
		}
	}
</script>

<!-- svelte-ignore a11y-click-events-have-key-events -->
<!-- svelte-ignore a11y-no-static-element-interactions -->
<color-control class:selected style="--color: rgb({hsv_to_rgb(hsv).join(' ')})" on:click={onclick}>
	{#each hsv as v, i}
		<color-handle
			class={i == 0 ? 'h' : i == 1 ? 's' : 'v'}
			style="--position: {v * (height - 20)}px"
			on:pointerdown={pointerdown}
			on:pointerup={pointerup}
			on:pointermove={pointermove}
		></color-handle>
	{/each}
</color-control>

<style>
	color-control {
		display: block;
		height: 100%;
		background-color: var(--color);
		flex: 1;
		cursor: default;
		position: relative;
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
		position: absolute;
		border: 2px solid #000;
		background-color: #fff;
		width: 16px;
		height: 16px;
		border-radius: 50%;

		z-index: 30;

		top: calc(var(--position) - 8px + 10px);
		left: calc(50% - 8px);
	}

	.selected color-handle {
		background-color: #333;
	}
</style>
