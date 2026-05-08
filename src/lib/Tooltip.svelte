<script lang="ts">
	import type { Snippet } from 'svelte';

	type Placement = 'top' | 'bottom' | 'left' | 'right';

	interface Props {
		text: string;
		placement?: Placement;
		/** Delay (ms) before the tooltip appears. */
		delay?: number;
		children: Snippet;
	}

	let { text, placement = 'top', delay = 200, children }: Props = $props();

	let id = $props.id();
	let visible = $state(false);
	let timer: ReturnType<typeof setTimeout> | null = null;

	function show() {
		if (timer) clearTimeout(timer);
		timer = setTimeout(() => {
			visible = true;
		}, delay);
	}
	function hide() {
		if (timer) {
			clearTimeout(timer);
			timer = null;
		}
		visible = false;
	}
</script>

<!--
	Wraps a single trigger element. The trigger receives `aria-describedby` so
	assistive tech announces the tooltip text.
-->
<!-- svelte-ignore a11y_no_static_element_interactions -->
<tooltip-root
	onmouseenter={show}
	onmouseleave={hide}
	onfocusin={show}
	onfocusout={hide}
	aria-describedby={visible ? id : undefined}
>
	{@render children()}

	{#if visible}
		<tooltip-bubble role="tooltip" {id} class={`placement-${placement}`}>
			{text}
		</tooltip-bubble>
	{/if}
</tooltip-root>

<style>
	tooltip-root {
		position: relative;
		display: inline-flex;
	}

	tooltip-bubble {
		position: absolute;
		z-index: 100;
		background-color: var(--surface);
		color: var(--surface-text-01);
		border: 1px solid var(--surface-border);
		border-radius: var(--radius-sm);
		padding: var(--sp-01) var(--sp-02);
		font-size: 0.75rem;
		white-space: nowrap;
		pointer-events: none;
		box-shadow: rgba(0, 0, 0, 0.2) 0 2px 6px;
	}

	tooltip-bubble.placement-top {
		bottom: calc(100% + var(--sp-01));
		left: 50%;
		transform: translateX(-50%);
	}
	tooltip-bubble.placement-bottom {
		top: calc(100% + var(--sp-01));
		left: 50%;
		transform: translateX(-50%);
	}
	tooltip-bubble.placement-left {
		right: calc(100% + var(--sp-01));
		top: 50%;
		transform: translateY(-50%);
	}
	tooltip-bubble.placement-right {
		left: calc(100% + var(--sp-01));
		top: 50%;
		transform: translateY(-50%);
	}
</style>
