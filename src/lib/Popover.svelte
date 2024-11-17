<script lang="ts">
	import type { Snippet } from 'svelte';

	type Props = {
		trigger: Snippet<[{ open: () => void }]>;
		content: Snippet<[{ close: () => void }]>;
		onclose?: () => void;
	};

	let { trigger, content, onclose }: Props = $props();

	let isOpen = $state(false);

	let triggerEl = $state() as HTMLElement;
	let contentEl = $state<HTMLElement>();

	function open() {
		isOpen = true;
	}
	function close() {
		onclose?.();
		isOpen = false;
	}
</script>

<svelte:window
	onclick={(e) => {
		if (
			e.target instanceof Element &&
			(!e.target.isConnected || triggerEl.contains(e.target) || contentEl?.contains(e.target))
		) {
			return;
		}
		close();
	}}
/>

<div>
	<popover-trigger bind:this={triggerEl}>
		{@render trigger({ open })}
	</popover-trigger>
	{#if isOpen}
		<popover-content bind:this={contentEl}>
			{@render content({ close })}
		</popover-content>
	{/if}
</div>

<style>
	div {
		position: relative;
	}
	popover-content {
		position: absolute;
		z-index: 1;
		background-color: #444;
		color: #eee;
		border-radius: 5px;
		box-shadow: rgba(0, 0, 0, 0.35) 0px 5px 15px;
	}
</style>
