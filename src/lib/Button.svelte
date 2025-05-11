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
		background-color: var(--primary-background);
		color: var(--primary-text-01);
		border-radius: 5px;
		cursor: pointer;

		white-space: nowrap;

		font-size: 0.9rem;
		padding: var(--sp-02) var(--sp-04);

		transition:
			background-color 0.15s,
			color 0.15s;

		&:not(:disabled) {
			&:hover {
				background-color: var(--primary-hover);
				color: var(--primary-hover-text-01);
			}
		}
		&:disabled {
			background-color: var(--primary-disabled);
			color: var(--primary-disabled-text-01);
			cursor: not-allowed;
		}
	}
</style>
