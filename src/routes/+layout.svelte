<script lang="ts">
	import Button from '$lib/Button.svelte';
	import { open, save } from '@tauri-apps/plugin-dialog';
	import type { Snippet } from 'svelte';
	import type { LayoutData } from './$types.js';
	import FileSelected from './FileSelected.svelte';

	type Props = {
		children: Snippet;
		data: LayoutData;
	};
	let { children, data }: Props = $props();
</script>

{#if data.filename}
	<FileSelected {children} />
{:else}
	No file selected

	<Button
		onclick={() => {
			save({ title: 'Create Database',  });
		}}
	>
		New
	</Button>

	<Button
		onclick={() => {
			open({ title: `Open existing database`, multiple: false, directory: false });
		}}
	>
		Open Explorer
	</Button>
{/if}
