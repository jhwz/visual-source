<script lang="ts">
	import type { Component, Snippet } from 'svelte';

	type Variant = 'primary' | 'secondary' | 'ghost' | 'destructive' | 'error';
	type Size = 'sm' | 'md';

	interface Props {
		icon?: Component | null;
		disabled?: boolean;
		onclick?: (event: MouseEvent) => void;
		children?: Snippet;
		/** Visual style variant. `error` is kept as an alias for `destructive`. */
		type?: Variant;
		/** Control size. Defaults to `md`. */
		size?: Size;
	}

	let {
		icon: Icon = null,
		disabled = false,
		onclick,
		children,
		type = 'primary',
		size = 'md'
	}: Props = $props();

	// `error` is an alias for `destructive` — keep so existing call sites still compile.
	let resolvedVariant = $derived(type === 'error' ? 'destructive' : type);
</script>

<button
	{onclick}
	class:icon={!!Icon}
	{disabled}
	class={[resolvedVariant, `size-${size}`]}
>
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
		--border: transparent;
	}
	.secondary {
		--background: var(--surface);
		--text: var(--surface-text-01);
		--hover: var(--surface-hover);
		--hover-text: var(--surface-text-01);
		--disabled: var(--surface);
		--disabled-text: var(--surface-text-02);
		--border: var(--surface-border);
	}
	.ghost {
		--background: transparent;
		--text: var(--bg-text-01);
		--hover: var(--bg-hover);
		--hover-text: var(--bg-text-01);
		--disabled: transparent;
		--disabled-text: var(--bg-text-02);
		--border: transparent;
	}
	.destructive {
		--background: var(--error);
		--text: var(--error-text-01);
		--hover: var(--error-hover);
		--hover-text: var(--error-text-01);
		--disabled: var(--error-disabled);
		--disabled-text: var(--error-disabled-text-01);
		--border: transparent;
	}

	button {
		display: flex;
		align-items: center;
		justify-content: space-between;
		gap: var(--sp-02);

		border: 1px solid var(--border);
		background-color: var(--background);
		color: var(--text);
		border-radius: var(--radius-md);
		cursor: pointer;

		white-space: nowrap;

		font-size: 0.9rem;

		transition:
			background-color 0.15s,
			color 0.15s,
			border-color 0.15s;

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

	.size-md {
		min-height: var(--button-height-md);
		padding: var(--sp-02) var(--sp-04);
	}
	.size-sm {
		min-height: var(--button-height-sm);
		padding: var(--sp-01) var(--sp-02);
		font-size: 0.8rem;
	}
</style>
