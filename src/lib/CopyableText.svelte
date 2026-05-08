<script lang="ts">
	import Check from './icons/Check.svelte';
	import Copy from './icons/Copy.svelte';

	interface Props {
		value: string;
		/** Override the aria-label / tooltip text. Defaults to "Copy <value>". */
		label?: string;
	}

	let { value, label }: Props = $props();

	let copied = $state(false);
	let timer: ReturnType<typeof setTimeout> | null = null;
	let ariaLabel = $derived(label ?? `Copy ${value}`);

	async function copy() {
		try {
			await navigator.clipboard.writeText(value);
			copied = true;
			if (timer) clearTimeout(timer);
			timer = setTimeout(() => {
				copied = false;
			}, 1200);
		} catch {
			// Clipboard API can fail in unsupported contexts; silently ignore.
		}
	}
</script>

<button type="button" class="copyable" onclick={copy} aria-label={ariaLabel} title={ariaLabel}>
	<span class="value">{value}</span>
	<span class="icon" aria-hidden="true">
		{#if copied}
			<Check size={12} />
		{:else}
			<Copy size={12} />
		{/if}
	</span>
</button>

<style>
	.copyable {
		display: inline-flex;
		align-items: center;
		gap: var(--sp-01);
		padding: var(--sp-0p5) var(--sp-01);
		font-family: var(--font-mono);
		font-size: 0.75rem;
		color: var(--bg-text-02);
		background-color: transparent;
		border: 1px solid transparent;
		border-radius: var(--radius-sm);
		cursor: pointer;
		transition:
			background-color 0.12s,
			color 0.12s,
			border-color 0.12s;
	}

	.copyable:hover {
		color: var(--bg-text-01);
		background-color: var(--bg-hover);
	}
	.copyable:focus-visible {
		outline: 2px solid var(--primary);
		outline-offset: 1px;
	}

	.value {
		white-space: nowrap;
		overflow: hidden;
		text-overflow: ellipsis;
	}

	.icon {
		display: inline-flex;
		align-items: center;
		opacity: 0;
		transition: opacity 0.12s;
		color: inherit;
	}

	.copyable:hover .icon,
	.copyable:focus-visible .icon {
		opacity: 1;
	}
</style>
