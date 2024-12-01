<script lang="ts">
	import Button from '$lib/Button.svelte';
	import { spec, write_spec_outputs } from '$lib/spec.svelte.js';
	import { save } from '@tauri-apps/plugin-dialog';
	import type { PageData } from './$types.js';

	type Props = {
		data: PageData;
	};
	let {}: Props = $props();
</script>

<main>
	<h3>CSS</h3>

	<help-text>
		<p>Configure where to write your design tokens as CSS</p>
	</help-text>

	{#if !spec.outputs?.css?.filename}
		<Button
			onclick={async () => {
				const filename = await save();
				if (filename) {
					spec.outputs ||= {};
					spec.outputs.css = { filename };
					write_spec_outputs();
				}
			}}
		>
			Choose CSS Destination
		</Button>
	{:else}
		Saving to: {spec.outputs.css.filename}
	{/if}
</main>
