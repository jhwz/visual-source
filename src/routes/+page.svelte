<script lang="ts">
	import { invoke } from '@tauri-apps/api/tauri';
	import type { PageData } from './$types.js';
	import type { Palette } from '$lib/palette.js';

	export let data: PageData;

	async function save(palettes: Palette[]) {
		await invoke('save', { data: JSON.stringify(palettes) });
		data.palettes = palettes;
	}
</script>

<page-grid>
	<page-header>
		<h1>Palette Manager</h1>
	</page-header>

	<page-sidebar>
		{#each data.palettes as p}
			{p.name}
		{/each}
	</page-sidebar>
	<colors-bar> colors go here </colors-bar>
	<colors-options> colors options go here </colors-options>
</page-grid>

<div>
	<button on:click={() => save([{ name: 'Palette 1', colors: ['#ffffff'] }])}>Save</button>
</div>

<style>
	page-grid {
		display: grid;
		grid-template-columns: 1fr 2fr 1fr;
	}
	page-header {
		grid-column: 1 / -1;
	}
</style>
