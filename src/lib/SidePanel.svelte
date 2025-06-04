<script lang="ts">
	import type { Snippet } from 'svelte';

	type Props = {
		children?: Snippet;
	};
	let { children }: Props = $props();
</script>

<side-panel>
	{@render children?.()}
</side-panel>

<style>
	side-panel {
		width: 300px;
		background-color: var(--surface);
		margin: var(--sp-04);
		margin-right: var(--sp-03);
		border-radius: 5px;
		box-shadow: rgba(0, 0, 0, 0.24) 0px 3px 8px;
	}
</style>
