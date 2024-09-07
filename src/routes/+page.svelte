<script lang="ts">
	import { invoke } from '@tauri-apps/api/core';
	import type { PageData } from './$types.js';
	import type { Palette } from '$lib/palette.js';
	import Plus from '$lib/icons/Plus.svelte';
	import Button from '$lib/Button.svelte';
	import PaletteButton from '$lib/PaletteButton.svelte';
	import ColorControl, { redraw_lines } from '$lib/ColorControl.svelte';
	import RgbInputs from '$lib/RGBInputs.svelte';
	import HsvInputs from '$lib/HSVInputs.svelte';
	import Minus from '$lib/icons/Minus.svelte';
	import { onMount, tick } from 'svelte';

	type Props = {
		data: PageData;
	};

	let { data = $bindable() }: Props = $props();

	let palettes = $state(data.palettes);

	async function save(p: Palette[]) {
		await invoke('save', { data: JSON.stringify(p) });
		palettes = p;
		tick().then(redraw_lines);
	}

	function set_up(): number {
		if (palettes.length === 0) {
			palettes = [
				{
					name: 'Palette 1',
					colors: ['#ffffff', '#AAAAAA', '#555555', '#000000']
				}
			];
		}
		return 0;
	}

	function add_color() {
		if (palette.colors.length === 0) {
			palette.colors.push('#ffffff');
		} else {
			palette.colors.push(palette.colors.at(-1) as string);
		}
		save(palettes);
	}

	function delete_color() {
		palette.colors = palette.colors.filter((_, j) => j !== colorIndex);
		colorIndex = Math.min(Math.max(colorIndex! - 1, 0), palette.colors.length - 1);
		save(palettes);
	}

	let paletteIndex = $state(set_up());
	let palette = $state(data.palettes[0]);
	$effect(() => {
		palette = palettes[paletteIndex];
	});

	let colorIndex: number | null = $state(null);

	let colorsHeight = $state(0);

	onMount(redraw_lines);
</script>

<svelte:window onresize={redraw_lines} />

<page-grid>
	<page-sidebar>
		<palette-buttons>
			<button
				onclick={() => {
					palettes.push({
						name: `Palette ${palettes.length + 1}`,
						colors: []
					});
					paletteIndex = palettes.length - 1;
					colorIndex = null;
					save(palettes);
				}}
			>
				<Plus />
			</button>
			<button
				onclick={() => {
					palettes = palettes.filter((_, i) => i !== paletteIndex);
					paletteIndex = palettes.length - 1;
					save(palettes);
				}}
				disabled={palettes.length <= 1}
			>
				<Minus />
			</button>
		</palette-buttons>

		{#each palettes as p, i}
			<PaletteButton
				name={p.name}
				selected={paletteIndex === i}
				onclick={() => {
					paletteIndex = i;
					colorIndex = null;
					tick().then(redraw_lines);
				}}
				onchange={(name) => {
					p.name = name;
					save(palettes);
				}}
			/>
		{/each}
	</page-sidebar>
	<colors-section>
		<colors-bar bind:clientHeight={colorsHeight}>
			{#each palette.colors as color, i}
				{@const selected = colorIndex === i}
				<ColorControl
					{color}
					{selected}
					height={colorsHeight}
					onclick={() => {
						if (i == colorIndex) colorIndex = null;
						else colorIndex = i;
					}}
					onchange={(color) => {
						palette.colors[i] = color;
						save(palettes);
					}}
				/>
			{/each}
		</colors-bar>
	</colors-section>
	<colors-options>
		<Button icon={Plus} on:click={add_color}>Add Color</Button>
		{#if colorIndex != null}
			{@const color = palette.colors[colorIndex]}
			<color-values-grid>
				<span> RGB </span>
				<RgbInputs
					{color}
					onchange={(color) => {
						palette.colors[colorIndex!] = color;
						save(palettes);
					}}
				/>
				<span> HSV </span>
				<HsvInputs {color} />
			</color-values-grid>
			<Button icon={Minus} on:click={delete_color} disabled={palette.colors.length <= 1}>
				Delete Color
			</Button>
		{/if}
	</colors-options>
</page-grid>

<style>
	page-grid {
		display: grid;
		grid-template-columns: auto 2fr 1fr;
		height: 100%;
		padding: var(--sp-06) var(--sp-05);
	}
	color-values-grid {
		display: grid;
		grid-template-columns: auto 1fr;
		align-items: center;
		column-gap: var(--sp-02);
		row-gap: var(--sp-02);

		border-top: 1px solid #555;
		border-bottom: 1px solid #555;
		padding: var(--sp-05) 0;
	}
	color-values-grid span {
		color: #ddd;
		font-size: small;
	}

	colors-section {
		display: block;
		padding: 0 var(--sp-08);
		height: 100%;
	}

	colors-bar {
		display: flex;
		height: 100%;
	}

	colors-options {
		display: flex;
		flex-direction: column;
		gap: var(--sp-05);
	}

	palette-buttons {
		display: flex;
		justify-content: end;
		gap: var(--sp-02);
		padding-bottom: var(--sp-02);
		margin-bottom: var(--sp-02);
		border-bottom: 1px solid #555;
	}
	palette-buttons button {
		color: #aaa;
	}
	palette-buttons button:hover {
		color: #ccc;
	}
</style>
