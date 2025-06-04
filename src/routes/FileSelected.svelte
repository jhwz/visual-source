<script lang="ts">
	import { goto } from '$app/navigation';
	import { page } from '$app/stores';
	import Minus from '$lib/icons/Minus.svelte';
	import Plus from '$lib/icons/Plus.svelte';
	import PaletteButton from '$lib/PaletteButton.svelte';
	import SidebarLink from '$lib/SidebarLink.svelte';
	import { spec } from '$lib/spec.svelte.js';
	import type { Snippet } from 'svelte';
	import { fromStore } from 'svelte/store';

	type Props = {
		children: Snippet;
	};
	let { children }: Props = $props();

	let pagerune = fromStore(page);

	let paletteIndex = $derived.by(() => {
		if (pagerune.current.route.id === '/palettes' && pagerune.current.url.searchParams.has('idx'))
			return parseInt(pagerune.current.url.searchParams.get('idx')!);
		return null;
	});
</script>

<page-grid>
	<page-sidebar>
		<app-name>Visual Source</app-name>
		<SidebarLink href="/" routeId="/">Color Tokens</SidebarLink>

		<SidebarLink href="/spacing" routeId="/spacing">Spacing Tokens</SidebarLink>

		<palettes-section>
			<palette-header>
				Palettes

				<button
					class="add-palette"
					onclick={() => {
						spec.palettes.push({
							name: `Palette ${spec.palettes.length + 1}`,
							colors: []
						});
						goto(`/palettes?idx=${spec.palettes.length - 1}`);
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
					onclick={() => goto(`/palettes?idx=${i}`)}
					onchange={(name) => {
						p.name = name;
					}}
					colors={p.colors}
				/>
			{/each}
		</palettes-section>
	</page-sidebar>

	<main>
		{@render children()}
	</main>
</page-grid>

<style>
	page-grid {
		display: grid;
		grid-template-columns: 16rem 1fr;
		height: 100%;
	}

	page-sidebar {
		display: flex;
		flex-direction: column;
		gap: var(--sp-02);
		overflow-y: auto;
		padding: var(--sp-04) var(--sp-04);
	}

	app-name {
		display: flex;
		align-items: center;
		justify-content: center;
		padding: var(--sp-04) 0;
		font-weight: bold;
		margin-bottom: var(--sp-04);
		border: 1px solid var(--bg-border);
		border-radius: 10px;
		font-size: large;
	}

	main {
		display: block;
		height: 100%;
		overflow-y: auto;
	}

	palettes-section {
		display: flex;
		flex-direction: column;
		margin-top: var(--sp-02);
	}

	palette-header {
		display: flex;
		color: var(--bg-text-02);
		font-size: small;
		font-weight: bold;
		gap: var(--sp-02);
		padding-bottom: var(--sp-02);
		margin-bottom: var(--sp-02);
		padding-left: var(--sp-02);
		border-bottom: 1px solid var(--bg-border);

		.add-palette {
			margin-left: auto;
		}
		button {
			color: var(--bg-text-02);
			padding: var(--sp-01);
			border-radius: 7px;
			&:hover {
				background-color: var(--bg-hover);
				color: var(--primary);
			}
		}
	}
</style>
