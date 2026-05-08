<script lang="ts">
	import type { Snippet } from 'svelte';

	interface Props {
		title: string;
		description?: string;
		/** Right-aligned actions (e.g. primary buttons). */
		actions?: Snippet;
		/** Optional content between the title and actions, e.g. save state. */
		status?: Snippet;
	}

	let { title, description, actions, status }: Props = $props();
</script>

<page-header>
	<header-text>
		<h1>{title}</h1>
		{#if description}
			<header-description>{description}</header-description>
		{/if}
	</header-text>

	{#if status}
		<header-status>
			{@render status()}
		</header-status>
	{/if}

	{#if actions}
		<header-actions>
			{@render actions()}
		</header-actions>
	{/if}
</page-header>

<style>
	page-header {
		display: flex;
		align-items: center;
		gap: var(--sp-04);
		padding: var(--sp-04) var(--sp-06);
		border-bottom: 1px solid var(--bg-border);
	}

	header-text {
		display: flex;
		flex-direction: column;
		gap: var(--sp-0p5);
		min-width: 0;
		flex: 1;
	}

	h1 {
		margin: 0;
		font-size: 1.125rem;
		font-weight: 600;
		color: var(--bg-text-01);
		line-height: 1.25;
	}

	header-description {
		display: block;
		color: var(--bg-text-02);
		font-size: 0.85rem;
		line-height: 1.3;
	}

	header-status {
		display: flex;
		align-items: center;
		color: var(--bg-text-02);
		font-size: 0.8rem;
	}

	header-actions {
		display: flex;
		align-items: center;
		gap: var(--sp-02);
		margin-left: auto;
	}
</style>
