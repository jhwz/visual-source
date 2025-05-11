<script lang="ts">
	import type { Snippet } from 'svelte';
	import type { LayoutData } from './$types.js';
	import FileSelected from './FileSelected.svelte';

	type Props = {
		children: Snippet;
		data: LayoutData;
	};
	let { children, data }: Props = $props();
</script>

<FileSelected>
	{@render children()}
</FileSelected>
