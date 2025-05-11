<script lang="ts">
	import { afterNavigate } from '$app/navigation';
	import Button from '$lib/Button.svelte';
	import HsvInputs from '$lib/HSVInputs.svelte';
	import Minus from '$lib/icons/Minus.svelte';
	import Plus from '$lib/icons/Plus.svelte';
	import RgbInputs from '$lib/RGBInputs.svelte';
	import SidePanel from '$lib/SidePanel.svelte';
	import { spec } from '$lib/spec.svelte.js';
	import type { PageData } from './$types.js';
	import ColorControl from './ColorControl.svelte';

	type Props = {
		data: PageData;
	};
	let { data }: Props = $props();

	let palette = $derived(spec.palettes[data.idx]);

	function add_color() {
		if (spec.palettes[data.idx].colors.length === 0) {
			spec.palettes[data.idx].colors.push('#ffffff');
		} else {
			spec.palettes[data.idx].colors.push(spec.palettes[data.idx].colors.at(-1) as string);
		}
	}

	function delete_color() {
		spec.palettes[data.idx].colors = spec.palettes[data.idx].colors.filter(
			(_, j) => j !== colorIndex
		);
		colorIndex = Math.min(Math.max(colorIndex! - 1, 0), spec.palettes[data.idx].colors.length - 1);
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
						spec.palettes[data.idx].colors[i] = color;
					}}
				/>
			{/each}
		</colors-section>

		<SidePanel>
			<colors-options>
				<Button icon={Plus} onclick={add_color}>Add Color</Button>
				{#if colorIndex != null}
					{@const color = spec.palettes[data.idx].colors[colorIndex]}
					<color-values-grid>
						<span> RGB </span>
						<RgbInputs
							{color}
							onchange={(color) => {
								spec.palettes[data.idx].colors[colorIndex!] = color;
							}}
						/>
						<span> HSV </span>
						<HsvInputs {color} />
					</color-values-grid>
					<Button
						icon={Minus}
						onclick={delete_color}
						disabled={spec.palettes[data.idx].colors.length <= 1}
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
