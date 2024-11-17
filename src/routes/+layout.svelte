<script lang="ts">
	import { goto } from '$app/navigation';
	import { page } from '$app/stores';
	import Minus from '$lib/icons/Minus.svelte';
	import Plus from '$lib/icons/Plus.svelte';
	import PaletteButton from '$lib/PaletteButton.svelte';
	import { spec } from '$lib/spec.svelte.js';
	import type { Snippet } from 'svelte';

	type Props = {
		children: Snippet;
	};
	let { children }: Props = $props();

	let paletteIndex = $derived.by(() => {
		if ($page.params.idx) return parseInt($page.params.idx);
		return null;
	});
</script>

<page-grid>
	<page-sidebar>
		<a href="/">Tokens</a>

		<palette-header>
			Palettes

			<button
				class="add-palette"
				onclick={() => {
					spec.palettes.push({
						name: `Palette ${spec.palettes.length + 1}`,
						colors: []
					});
					goto(`/palettes/${spec.palettes.length - 1}`);
				}}
			>
				<Plus />
			</button>
			{#if paletteIndex != null}
				<button
					class="remove-palette"
					onclick={() => {
						spec.palettes = spec.palettes.filter((_, i) => i !== paletteIndex);
						goto('/');
					}}
				>
					<Minus />
				</button>
			{/if}
		</palette-header>

		{#each spec.palettes as p, i}
			<PaletteButton
				name={p.name}
				selected={paletteIndex === i}
				onclick={() => goto(`/palettes/${i}`)}
				onchange={(name) => {
					p.name = name;
				}}
			/>
		{/each}
	</page-sidebar>

	{@render children()}
</page-grid>

<style>
	page-grid {
		display: grid;
		grid-template-columns: auto 1fr;
		height: 100%;
		padding: var(--sp-06) var(--sp-05);
	}

	palette-header {
		display: flex;
		color: #aaa;
		font-size: small;
		gap: var(--sp-02);
		padding-bottom: var(--sp-02);
		margin-bottom: var(--sp-02);
		border-bottom: 1px solid #555;
	}
	button.add-palette {
		margin-left: auto;
	}
	palette-header button {
		color: #aaa;
	}
	palette-header button:hover {
		color: #ccc;
	}
</style>
