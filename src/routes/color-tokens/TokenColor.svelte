<script lang="ts">
	import ArrowLeft from '$lib/icons/ArrowLeft.svelte';
	import ArrowRight from '$lib/icons/ArrowRight.svelte';
	import Close from '$lib/icons/Close.svelte';
	import Link from '$lib/icons/Link.svelte';
	import Popover from '$lib/Popover.svelte';
	import { resolve_ref } from '$lib/reftype.js';
	import { spec, type Token } from '$lib/spec.svelte.js';

	type Props = {
		token: Token;
	};
	let { token = $bindable() }: Props = $props();

	let selectedPaletteID = $state<null | number>(null);
</script>

{#if !token.$ref}
	<manual-color>
		<input type="color" bind:value={token.value} />
		<input type="text" bind:value={token.value} />
	</manual-color>
{/if}

<Popover
	onclose={() => {
		selectedPaletteID = null;
	}}
>
	{#snippet trigger({ open })}
		<button
			class="link-token"
			class:linked={!!token.$ref}
			onclick={() => {
				if (token.$ref) {
					selectedPaletteID = parseInt(token.$ref.split('/')[3]);
				}
				open();
			}}
		>
			<Link size={14} />
			{#if !token.$ref}
				Link
			{:else}
				{@const parts = token.$ref.split('/')}
				{@const paletteId = parseInt(parts[3])}
				{@const color = parseInt(parts[5])}
				{@const palette = spec.color.palettes.find((p) => p.id === paletteId)}

				{palette?.name || paletteId} ({color + 1})
			{/if}
		</button>
	{/snippet}
	{#snippet content({ close })}
		<popover-content>
			{#if selectedPaletteID != null}
				{@const palette = spec.color.palettes.find((p) => p.id === selectedPaletteID)!}
				<button
					class="on-back"
					onclick={() => {
						selectedPaletteID = null;
					}}
				>
					<ArrowLeft /> Back
				</button>

				{#each palette.colors as c, i}
					<button
						class="palette-color"
						onclick={() => {
							token.$ref = `#/color/palettes/${palette.id}/colors/${i}`;
							token.value = undefined;
							close();
						}}
					>
						{c} ({i + 1})
						<color-indicator style="--color: {c}"></color-indicator>
					</button>
				{/each}
			{:else}
				{#each spec.color.palettes as p}
					<button
						class="select-palette"
						onclick={() => {
							selectedPaletteID = p.id;
						}}
					>
						{p.name}
						<span><ArrowRight /></span>
					</button>
				{/each}
				{#if !!token.$ref}
					<button
						class="select-palette unlink"
						onclick={() => {
							const resolved = resolve_ref(spec, token.$ref!);
							if (resolved) token.value = resolved as string;
							else token.value = '#000000';
							token.$ref = undefined;
							close();
						}}
					>
						Unlink
						<span><Close /></span>
					</button>
				{/if}
			{/if}
		</popover-content>
	{/snippet}
</Popover>

<style>
	manual-color {
		display: inline-flex;
		align-items: stretch;
		gap: var(--sp-02);
	}
	.link-token {
		color: #999;
		display: flex;
		align-items: center;
		gap: var(--sp-01);

		&:hover {
			color: #ccc;
		}
		&.linked {
			color: #0a0;
		}
	}

	popover-content {
		display: flex;
		flex-direction: column;
		min-width: 16rem;
	}

	.select-palette {
		display: flex;
		justify-content: space-between;
		background-color: #333;
		color: #ccc;
		padding: var(--sp-01) var(--sp-02);
		border: none;
		transition: background-color 0.15s;
		&:hover {
			background-color: #444;
		}
		span {
			display: none;
		}
		&:hover span {
			display: block;
		}
		&.unlink {
			color: #e00;
		}
	}

	.palette-color {
		display: flex;
		justify-content: space-between;
		background-color: #333;
		color: #ccc;
		padding: var(--sp-01) var(--sp-02);
		border: none;
		transition: background-color 0.15s;
		&:hover {
			background-color: #444;
		}
		color-indicator {
			width: 20px;
			height: 20px;
			background-color: var(--color);
		}
	}
	.on-back {
		display: flex;
		gap: var(--sp-03);
		background-color: #333;
		color: #aaa;
		padding: var(--sp-01) var(--sp-02);
		border: none;
		transition: background-color 0.15s;
		&:hover {
			background-color: #444;
			color: #ccc;
		}
	}
</style>
