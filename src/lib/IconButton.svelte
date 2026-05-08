<script lang="ts">
	import type { Component } from 'svelte';
	import Tooltip from './Tooltip.svelte';

	type Variant = 'ghost' | 'subtle';
	type Size = 'sm' | 'md';

	interface Props {
		icon: Component;
		/** Used for `aria-label` and the tooltip text. */
		label: string;
		variant?: Variant;
		size?: Size;
		onclick?: (event: MouseEvent) => void;
		disabled?: boolean;
		/** Hide the tooltip when set to true. Useful when nesting in popovers. */
		notooltip?: boolean;
	}

	let {
		icon: Icon,
		label,
		variant = 'ghost',
		size = 'md',
		onclick,
		disabled = false,
		notooltip = false
	}: Props = $props();

	let iconSize = $derived(size === 'sm' ? 14 : 16);
</script>

{#snippet trigger()}
	<button
		type="button"
		{onclick}
		{disabled}
		aria-label={label}
		class={[variant, `size-${size}`]}
	>
		<Icon size={iconSize} />
	</button>
{/snippet}

{#if notooltip}
	{@render trigger()}
{:else}
	<Tooltip text={label}>
		{@render trigger()}
	</Tooltip>
{/if}

<style>
	button {
		display: inline-flex;
		align-items: center;
		justify-content: center;
		border: 1px solid transparent;
		border-radius: var(--radius-md);
		cursor: pointer;
		color: var(--bg-text-02);
		background-color: transparent;
		transition:
			background-color 0.12s,
			color 0.12s,
			border-color 0.12s;
	}
	button:not(:disabled):hover {
		color: var(--bg-text-01);
		background-color: var(--bg-hover);
	}
	button:focus-visible {
		outline: 2px solid var(--primary);
		outline-offset: 1px;
	}
	button:disabled {
		opacity: 0.5;
		cursor: not-allowed;
	}

	.subtle {
		background-color: var(--surface);
		color: var(--surface-text-02);
	}
	.subtle:not(:disabled):hover {
		background-color: var(--surface-hover);
		color: var(--surface-text-01);
	}

	.size-md {
		width: var(--button-height-md);
		height: var(--button-height-md);
	}
	.size-sm {
		width: var(--button-height-sm);
		height: var(--button-height-sm);
	}
</style>
