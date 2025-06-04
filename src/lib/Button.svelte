<script lang="ts">
	import type { Component } from 'svelte';

	type Props = {
		icon?: Component | null;
		disabled?: boolean;
		onclick?: (event: any) => void;
		children?: import('svelte').Snippet;
		type?: 'primary' | 'error';
	};

	let {
		icon: Icon = null,
		disabled = false,
		onclick,
		children,
		type = 'primary'
	}: Props = $props();
</script>

<button {onclick} class:icon={!!Icon} {disabled} class={{ [type]: true }}>
	{@render children?.()}

	{#if Icon}<Icon />{/if}
</button>

<style>
	.primary {
		--background: var(--primary);
		--text: var(--primary-text-01);
		--hover: var(--primary-hover);
		--hover-text: var(--primary-text-01);
		--disabled: var(--primary-disabled);
		--disabled-text: var(--primary-disabled-text-01);
	}
	.error {
		--background: var(--error);
		--text: var(--error-text-01);
		--hover: var(--error-hover);
		--hover-text: var(--error-text-01);
		--disabled: var(--error-disabled);
		--disabled-text: var(--error-disabled-text-01);
	}
	button {
		display: flex;
		align-items: center;
		justify-content: space-between;
		gap: var(--sp-02);

		border: none;
		background-color: var(--background);
		color: var(--text);
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
				background-color: var(--hover);
				color: var(--hover-text);
			}
		}
		&:disabled {
			background-color: var(--disabled);
			color: var(--disabled-text);
			cursor: not-allowed;
		}
	}
</style>
