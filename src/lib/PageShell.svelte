<script lang="ts">
	import type { Snippet } from 'svelte';
	import SidePanel from './SidePanel.svelte';

	interface Props {
		/** Optional header snippet, usually a `<PageHeader />`. */
		header?: Snippet;
		/** Main content. */
		main: Snippet;
		/** Optional right-rail content. When omitted the rail collapses entirely. */
		aside?: Snippet;
	}

	let { header, main, aside }: Props = $props();
</script>

<page-shell class:has-aside={!!aside}>
	{#if header}
		<page-shell-header>
			{@render header()}
		</page-shell-header>
	{/if}

	<page-shell-body>
		<page-shell-main>
			{@render main()}
		</page-shell-main>

		{#if aside}
			<SidePanel>
				{@render aside()}
			</SidePanel>
		{/if}
	</page-shell-body>
</page-shell>

<style>
	page-shell {
		display: grid;
		grid-template-rows: auto 1fr;
		height: 100%;
		min-height: 0;
	}

	page-shell-header {
		display: block;
	}

	page-shell-body {
		display: grid;
		grid-template-columns: 1fr;
		min-height: 0;
		overflow: hidden;
	}
	page-shell.has-aside page-shell-body {
		grid-template-columns: 1fr auto;
	}

	page-shell-main {
		display: block;
		min-width: 0;
		overflow-y: auto;
	}
</style>
