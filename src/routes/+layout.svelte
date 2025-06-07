<script lang="ts">
	import { goto } from '$app/navigation';
	import { page } from '$app/state';
	import Minus from '$lib/icons/Minus.svelte';
	import Plus from '$lib/icons/Plus.svelte';
	import PaletteButton from '$lib/PaletteButton.svelte';
	import SidebarLink from '$lib/SidebarLink.svelte';
	import { spec } from '$lib/spec.svelte.js';
	import { next_id } from '$lib/utils';
	import type { LayoutProps } from './$types';
	import WelcomeModal from './WelcomeModal.svelte';

	let { children }: LayoutProps = $props();

	let paletteIndex = $derived.by(() => {
		if (page.route.id === '/palettes' && page.url.searchParams.has('idx'))
			return parseInt(page.url.searchParams.get('idx')!);
		return null;
	});
</script>

<WelcomeModal />

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
						const id = next_id(spec.color.palettes);
						spec.color.palettes.push({
							id,
							name: `Palette ${spec.color.palettes.length + 1}`,
							colors: []
						});
						goto(`/palettes?id=${id}`);
					}}
				>
					<Plus />
				</button>
				{#if paletteIndex != null}
					<button
						class="remove-palette"
						onclick={() => {
							spec.color.palettes = spec.color.palettes.filter((_, i) => i !== paletteIndex);
							goto('/');
						}}
					>
						<Minus />
					</button>
				{/if}
			</palette-header>

			{#each spec.color.palettes as p, i}
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
		<svelte:boundary>
			{@render children()}
			{#snippet onerror(error, reset)}
				{error}
			{/snippet}
		</svelte:boundary>
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
