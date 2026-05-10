<script lang="ts">
	import { goto } from '$app/navigation';
	import { resolve } from '$app/paths';
	import { page } from '$app/state';
	import BrowserToolbar from '$lib/BrowserToolbar.svelte';
	import ConfirmDialog from '$lib/ConfirmDialog.svelte';
	import { environment } from '$lib/environment/index.js';
	import IconButton from '$lib/IconButton.svelte';
	import Minus from '$lib/icons/Minus.svelte';
	import Plus from '$lib/icons/Plus.svelte';
	import PaletteButton from '$lib/PaletteButton.svelte';
	import SidebarLink from '$lib/SidebarLink.svelte';
	import { spec, write_spec_outputs } from '$lib/spec.svelte.js';
	import ThemeSelector from '$lib/ThemeSelector.svelte';
	import { next_id } from '$lib/utils';
	import WelcomeModal from '$lib/WelcomeModal.svelte';
	import type { LayoutProps } from './$types';

	let { children }: LayoutProps = $props();

	let paletteID = $derived.by(() => {
		if (page.route.id === '/palettes' && page.url.searchParams.has('id'))
			return parseInt(page.url.searchParams.get('id')!);
		return null;
	});

	let activePalette = $derived(
		paletteID == null ? null : (spec.color.palettes.find((p) => p.id === paletteID) ?? null)
	);

	let confirmPaletteOpen = $state(false);
	let rerender = $state(0);

	function add_palette() {
		const id = next_id(spec.color.palettes);
		spec.color.palettes.push({
			id,
			name: `Palette ${spec.color.palettes.length + 1}`,
			colors: ['#ffffff']
		});
		goto(resolve(`/palettes?id=${id}`));
	}

	function request_remove_palette() {
		if (paletteID == null) return;
		confirmPaletteOpen = true;
	}

	function remove_palette() {
		if (paletteID == null) return;
		spec.color.palettes = spec.color.palettes.filter((p) => p.id !== paletteID);
		goto(resolve('/'));
	}
</script>

<WelcomeModal
	oncomplete={() => {
		rerender++;
		write_spec_outputs();
	}}
/>

<page-grid>
	<page-sidebar>
		<app-name>Visual Source</app-name>

		<sidebar-nav>
			<SidebarLink href={resolve('/')} routeId="/">Color Tokens</SidebarLink>
			<SidebarLink href={resolve('/spacing')} routeId="/spacing">Spacing Tokens</SidebarLink>
			<SidebarLink href={resolve('/general-tokens')} routeId="/general-tokens">General Tokens</SidebarLink>
		</sidebar-nav>

		<ThemeSelector />

		<palettes-section>
			<sidebar-section-header>
				<span>Palettes</span>
				<header-actions>
					<IconButton icon={Plus} label="Add palette" size="sm" onclick={add_palette} />
					{#if activePalette}
						<IconButton
							icon={Minus}
							label="Remove selected palette"
							size="sm"
							onclick={request_remove_palette}
						/>
					{/if}
				</header-actions>
			</sidebar-section-header>

			{#if spec.color.palettes.length === 0}
				<empty-state>No palettes yet — click + or import a preset.</empty-state>
			{:else}
				{#each spec.color.palettes as p}
					<PaletteButton
						name={p.name}
						selected={paletteID === p.id}
						onclick={() => goto(resolve(`/palettes?id=${p.id}`))}
						onchange={(name) => {
							p.name = name;
						}}
						colors={p.colors}
					/>
				{/each}
			{/if}
		</palettes-section>

		{#if environment === 'browser'}
			<BrowserToolbar />
		{/if}
	</page-sidebar>

	<main>
		<svelte:boundary>
			<!-- Dirty hack to force this page to re-render -->
			{#key rerender}
				{@render children()}
			{/key}
			{#snippet onerror(error)}
				{error}
			{/snippet}
		</svelte:boundary>
	</main>
</page-grid>

<ConfirmDialog
	bind:open={confirmPaletteOpen}
	title="Delete palette?"
	message={activePalette
		? `Delete palette "${activePalette.name}"? This cannot be undone.`
		: 'Delete this palette?'}
	confirmLabel="Delete"
	variant="destructive"
	onconfirm={remove_palette}
/>

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
		padding: var(--sp-04);
	}

	app-name {
		display: block;
		padding: var(--sp-02) var(--sp-03);
		margin-bottom: var(--sp-02);
		font-weight: 600;
		font-size: 1rem;
		color: var(--bg-text-01);
		letter-spacing: -0.01em;
	}

	sidebar-nav {
		display: flex;
		flex-direction: column;
		gap: var(--sp-0p5);
	}

	main {
		display: block;
		height: 100%;
		overflow-y: auto;
	}

	palettes-section {
		display: flex;
		flex-direction: column;
		gap: var(--sp-0p5);
		margin-top: var(--sp-02);
	}

	sidebar-section-header {
		display: flex;
		align-items: center;
		gap: var(--sp-02);
		padding: var(--sp-01) var(--sp-02);
		margin-bottom: var(--sp-01);

		color: var(--bg-text-02);
		font-size: 0.7rem;
		font-weight: 600;
		text-transform: uppercase;
		letter-spacing: 0.05em;
	}

	header-actions {
		display: flex;
		align-items: center;
		gap: var(--sp-0p5);
		margin-left: auto;
	}

	empty-state {
		display: block;
		padding: var(--sp-02) var(--sp-03);
		color: var(--bg-text-02);
		font-size: 0.8rem;
		line-height: 1.4;
	}
</style>
