<script lang="ts">
	import { afterNavigate } from '$app/navigation';
	import Button from '$lib/Button.svelte';
	import HsvInputs from '$lib/HSVInputs.svelte';
	import Minus from '$lib/icons/Minus.svelte';
	import Plus from '$lib/icons/Plus.svelte';
	import RgbInputs from '$lib/RGBInputs.svelte';
	import SidePanel from '$lib/SidePanel.svelte';
	import { spec } from '$lib/spec.svelte.js';
	import { find_by_id } from '$lib/utils.js';
	import type { PageProps } from './$types.js';
	import ColorControl from './ColorControl.svelte';

	let { data }: PageProps = $props();
	let palette = $derived(find_by_id(spec.color.palettes, data.id));

	function add_color() {
		if (palette.colors.length === 0) {
			palette.colors.push('#ffffff');
		} else {
			palette.colors.push(palette.colors.at(-1)!);
		}
	}

	function delete_color() {
		palette.colors = palette.colors.filter((_, j) => j !== colorIndex);
		colorIndex = Math.min(Math.max(colorIndex! - 1, 0), palette.colors.length - 1);
	}

	let colorIndex: number | null = $state(null);

	afterNavigate(() => {
		colorIndex = null;
	});
</script>

{#if palette}
	<page-grid>
		<colors-section>
			{#each palette.colors as color, i}
				{@const selected = colorIndex === i}
				<ColorControl
					{color}
					prev={i - 1 === colorIndex ? null : palette.colors[i - 1] || null}
					next={i + 1 === colorIndex ? null : palette.colors[i + 1] || null}
					{selected}
					onclick={() => {
						colorIndex = i;
					}}
					onchange={(color) => {
						palette.colors[i] = color;
					}}
				/>
			{/each}
		</colors-section>

		<SidePanel>
			<colors-options>
				<Button icon={Plus} onclick={add_color}>Add Color</Button>
				{#if colorIndex != null}
					{@const color = palette.colors[colorIndex]}
					<color-index>{colorIndex + 1} / {palette.colors.length}</color-index>
					<color-values-grid>
						<span> RGB </span>
						<RgbInputs
							{color}
							onchange={(color) => {
								palette.colors[colorIndex!] = color;
							}}
						/>
						<span> HSV </span>
						<HsvInputs {color} />
					</color-values-grid>
					<Button
						icon={Minus}
						onclick={delete_color}
						disabled={palette.colors.length <= 1}
						type="error"
					>
						Delete Color
					</Button>
				{/if}
			</colors-options>
		</SidePanel>
	</page-grid>
{/if}

<style>
	page-grid {
		display: grid;
		grid-template-columns: 2fr auto;
		height: 100%;
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
		display: flex;
		padding: var(--sp-04) var(--sp-08);
		height: 100%;
		position: relative;
	}

	colors-options {
		display: flex;
		flex-direction: column;
		gap: var(--sp-05);
		padding: var(--sp-04) var(--sp-05);
	}
</style>
