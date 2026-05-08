<script lang="ts">
	import type { Snippet } from 'svelte';

	interface Props {
		/** Optional leading slot (swatch, icon, etc.). */
		leading?: Snippet;
		/** Title — string or a snippet for richer content. */
		title: string | Snippet;
		/** Optional secondary line, e.g. CSS variable name and value. */
		subtitle?: Snippet;
		/** Optional right-aligned slot, e.g. action buttons. */
		trailing?: Snippet;
		selected?: boolean;
		onclick?: (event: MouseEvent) => void;
		/** Render as a `<button>` (default) or a non-interactive `<div>`. */
		as?: 'button' | 'div';
	}

	let {
		leading,
		title,
		subtitle,
		trailing,
		selected = false,
		onclick,
		as = 'button'
	}: Props = $props();
</script>

{#if as === 'button'}
	<button type="button" class="list-row" class:selected {onclick}>
		{#if leading}
			<row-leading>{@render leading()}</row-leading>
		{/if}
		<row-content>
			<row-title>
				{#if typeof title === 'string'}{title}{:else}{@render title()}{/if}
			</row-title>
			{#if subtitle}
				<row-subtitle>{@render subtitle()}</row-subtitle>
			{/if}
		</row-content>
		{#if trailing}
			<row-trailing>{@render trailing()}</row-trailing>
		{/if}
	</button>
{:else}
	<div class="list-row" class:selected>
		{#if leading}
			<row-leading>{@render leading()}</row-leading>
		{/if}
		<row-content>
			<row-title>
				{#if typeof title === 'string'}{title}{:else}{@render title()}{/if}
			</row-title>
			{#if subtitle}
				<row-subtitle>{@render subtitle()}</row-subtitle>
			{/if}
		</row-content>
		{#if trailing}
			<row-trailing>{@render trailing()}</row-trailing>
		{/if}
	</div>
{/if}

<style>
	.list-row {
		display: grid;
		grid-template-columns: auto 1fr auto;
		align-items: center;
		gap: var(--sp-03);
		min-height: var(--row-height);
		padding: var(--sp-01) var(--sp-02);
		border: 1px solid transparent;
		border-radius: var(--radius-md);
		background-color: transparent;
		color: var(--bg-text-01);
		text-align: left;
		width: 100%;
		cursor: pointer;
		user-select: none;
		transition:
			background-color 0.12s,
			border-color 0.12s;
	}

	.list-row:hover {
		background-color: var(--bg-hover);
	}
	.list-row:focus-visible {
		outline: 2px solid var(--primary);
		outline-offset: -1px;
	}
	.list-row.selected {
		border-color: var(--primary);
	}

	row-leading {
		display: flex;
		align-items: center;
		justify-content: center;
		flex-shrink: 0;
	}

	row-content {
		display: flex;
		flex-direction: column;
		gap: var(--sp-0p5);
		min-width: 0;
	}

	row-title {
		display: block;
		color: var(--bg-text-01);
		font-size: 0.9rem;
		line-height: 1.25;
		overflow: hidden;
		text-overflow: ellipsis;
		white-space: nowrap;
	}

	row-subtitle {
		display: flex;
		align-items: center;
		gap: var(--sp-02);
		color: var(--bg-text-02);
		font-size: 0.75rem;
		line-height: 1.2;
		min-width: 0;
		overflow: hidden;
		text-overflow: ellipsis;
		white-space: nowrap;
	}

	row-trailing {
		display: flex;
		align-items: center;
		gap: var(--sp-01);
		flex-shrink: 0;
	}

	div.list-row {
		cursor: default;
	}
</style>
