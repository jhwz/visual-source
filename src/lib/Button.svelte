<script lang="ts">
	import type { Component } from 'svelte';

	type Props = {
		icon?: Component | null;
		disabled?: boolean;
		onclick?: (event: any) => void;
		children?: import('svelte').Snippet;
	};

	let { icon: Icon = null, disabled = false, onclick, children }: Props = $props();
</script>

<button {onclick} class:icon={!!Icon} {disabled}>
	{@render children?.()}

	{#if Icon}<Icon />{/if}
</button>

<style>
	button {
		display: flex;
		align-items: center;
		gap: var(--sp-02);

		border: none;
		background-color: #333;
		color: #fff;
		border-radius: 5px;
		cursor: pointer;

		white-space: nowrap;

		font-size: 0.9rem;
		padding: var(--sp-02) var(--sp-04);
	}
	button:disabled {
		color: #888;
		cursor: not-allowed;
	}

	button:not(:disabled):hover {
		background-color: #444;
	}
</style>
