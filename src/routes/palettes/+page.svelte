<script lang="ts">
	import { afterNavigate } from '$app/navigation';
	import { tick } from 'svelte';
	import Button from '$lib/Button.svelte';
	import IconButton from '$lib/IconButton.svelte';
	import PageHeader from '$lib/PageHeader.svelte';
	import PageShell from '$lib/PageShell.svelte';
	import Pencil from '$lib/icons/Pencil.svelte';
	import Plus from '$lib/icons/Plus.svelte';
	import { spec } from '$lib/spec.svelte.js';
	import { find_by_id } from '$lib/utils.js';
	import type { PageProps } from './$types.js';
	import ColorControl from './ColorControl.svelte';
	import StopEditor from './StopEditor.svelte';

	let { data }: PageProps = $props();
	let palette = $derived(find_by_id(spec.color.palettes, data.id));

	let colorIndex: number | null = $state(null);

	let renaming = $state(false);
	let nameDraft = $state('');
	let nameInput: HTMLInputElement | null = $state(null);

	afterNavigate(() => {
		colorIndex = null;
		renaming = false;
	});

	function add_color() {
		if (palette.colors.length === 0) {
			palette.colors.push('#ffffff');
		} else {
			palette.colors.push(palette.colors.at(-1)!);
		}
		colorIndex = palette.colors.length - 1;
	}

	function delete_color() {
		if (colorIndex == null) return;
		const i = colorIndex;
		palette.colors = palette.colors.filter((_, j) => j !== i);
		colorIndex = palette.colors.length === 0 ? null : Math.min(i, palette.colors.length - 1);
	}

	async function start_rename() {
		nameDraft = palette.name;
		renaming = true;
		await tick();
		nameInput?.focus();
		nameInput?.select();
	}

	function commit_rename() {
		const next = nameDraft.trim();
		if (next && next !== palette.name) {
			palette.name = next;
		}
		renaming = false;
	}

	function cancel_rename() {
		renaming = false;
	}

	function name_keydown(e: KeyboardEvent) {
		if (e.key === 'Enter') {
			e.preventDefault();
			commit_rename();
		} else if (e.key === 'Escape') {
			e.preventDefault();
			cancel_rename();
		}
	}

	let selectedColor = $derived(colorIndex != null ? palette?.colors[colorIndex] : null);
</script>

{#if palette}
	<PageShell>
		{#snippet header()}
			<page-header-host>
				{#if renaming}
					<rename-form>
						<input
							bind:this={nameInput}
							bind:value={nameDraft}
							onblur={commit_rename}
							onkeydown={name_keydown}
							aria-label="Palette name"
						/>
					</rename-form>
				{:else}
					<PageHeader
						title={palette.name}
						description="Drag the H, S, V handles to shape this palette."
					>
						{#snippet status()}
							<IconButton icon={Pencil} label="Rename palette" onclick={start_rename} />
						{/snippet}
						{#snippet actions()}
							<Button icon={Plus} type="secondary" onclick={add_color}>Add Color</Button>
						{/snippet}
					</PageHeader>
				{/if}
			</page-header-host>
		{/snippet}

		{#snippet main()}
			<main-area>
				{#if palette.colors.length === 0}
					<empty-state>
						<empty-title>This palette has no colors yet</empty-title>
						<empty-body>Add your first color stop to start shaping the H, S, V curves.</empty-body>
						<Button icon={Plus} onclick={add_color}>Add your first color</Button>
					</empty-state>
				{:else}
					<editor-stage>
						<axis-legend aria-hidden="true">
							<axis-row>Hue</axis-row>
							<axis-row>Saturation</axis-row>
							<axis-row>Value</axis-row>
						</axis-legend>

						<colors-section>
							{#each palette.colors as color, i}
								{@const selected = colorIndex === i}
								<ColorControl
									{color}
									label={String(i + 1)}
									prev={i - 1 === colorIndex ? null : palette.colors[i - 1] || null}
									next={i + 1 === colorIndex ? null : palette.colors[i + 1] || null}
									{selected}
									onclick={() => {
										colorIndex = i;
									}}
									onchange={(c) => {
										palette.colors[i] = c;
									}}
								/>
							{/each}
						</colors-section>
					</editor-stage>
				{/if}
			</main-area>
		{/snippet}

		{#snippet aside()}
			{#if colorIndex != null && selectedColor != null}
				<StopEditor
					color={selectedColor}
					index={colorIndex}
					total={palette.colors.length}
					canDelete={palette.colors.length > 1}
					onchange={(c) => {
						palette.colors[colorIndex!] = c;
					}}
					ondelete={delete_color}
				/>
			{:else}
				<aside-empty>
					{palette.colors.length === 0
						? 'Add a color to begin editing.'
						: 'Select a stop to edit its color.'}
				</aside-empty>
			{/if}
		{/snippet}
	</PageShell>
{/if}

<style>
	page-header-host {
		display: block;
	}

	rename-form {
		display: flex;
		align-items: center;
		gap: var(--sp-02);
		padding: var(--sp-04) var(--sp-06);
		border-bottom: 1px solid var(--bg-border);
	}
	rename-form input {
		flex: 1;
		font-size: 1.125rem;
		font-weight: 600;
		color: var(--bg-text-01);
		background-color: transparent;
		border: 1px solid var(--bg-border);
		border-radius: var(--radius-sm);
		padding: var(--sp-01) var(--sp-02);
	}
	rename-form input:focus {
		outline: 2px solid var(--primary);
		outline-offset: 1px;
	}

	main-area {
		display: block;
		height: 100%;
		min-height: 0;
	}

	editor-stage {
		display: grid;
		grid-template-columns: auto 1fr;
		align-items: stretch;
		height: 100%;
		padding: var(--sp-06) var(--sp-08) var(--sp-08);
		gap: var(--sp-04);
	}

	axis-legend {
		display: grid;
		grid-template-rows: 1fr 1fr 1fr;
		padding-bottom: 2rem;
		min-width: 5rem;
		color: var(--bg-text-02);
	}
	axis-row {
		display: flex;
		align-items: center;
		font-size: 0.75rem;
		font-weight: 500;
		text-transform: uppercase;
		letter-spacing: 0.04em;
	}

	colors-section {
		display: flex;
		gap: 2px;
		position: relative;
		padding-bottom: 2rem;
	}

	empty-state {
		display: flex;
		flex-direction: column;
		align-items: center;
		justify-content: center;
		gap: var(--sp-03);
		height: 100%;
		text-align: center;
		padding: var(--sp-06);
	}
	empty-title {
		font-size: 1rem;
		font-weight: 600;
		color: var(--bg-text-01);
	}
	empty-body {
		color: var(--bg-text-02);
		font-size: 0.875rem;
		max-width: 28rem;
		line-height: 1.4;
	}

	aside-empty {
		display: block;
		padding: var(--sp-06) var(--sp-05);
		color: var(--surface-text-02);
		font-size: 0.85rem;
		text-align: center;
	}
</style>
