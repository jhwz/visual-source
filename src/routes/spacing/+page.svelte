<script lang="ts">
	import { spec, themed_token_value } from '$lib/spec.svelte.js';
	import { activeTheme } from '$lib/theme-context.svelte.js';
	import Presets from './Presets.svelte';

	let theme = $derived(activeTheme());

	function get_override(tokenId: number) {
		if (!theme) return null;
		return theme.spacing.find((o) => o.tokenId === tokenId) ?? null;
	}

	function set_override_value(tokenId: number, value: string) {
		if (!theme) return;
		const existing = theme.spacing.find((o) => o.tokenId === tokenId);
		if (existing) {
			existing.value = value;
		} else {
			theme.spacing.push({ tokenId, value });
		}
	}

	function clear_override(tokenId: number) {
		if (!theme) return;
		theme.spacing = theme.spacing.filter((o) => o.tokenId !== tokenId);
	}
</script>

<main>
	{#if !spec.spacing.scale?.length}
		<Presets />
	{:else}
		<spacing-values class:has-theme={!!theme}>
			<span>Name</span>
			<span>Value</span>
			<span></span>
			{#if theme}<span></span>{/if}
			{#each spec.spacing.scale as v}
				<input type="text" bind:value={v.name} />
				{#if theme}
					{@const override = get_override(v.id)}
					<input
						type="text"
						value={override?.value ?? v.value ?? ''}
						class:overridden={!!override}
						oninput={(e) => set_override_value(v.id, e.currentTarget.value)}
					/>
					<spacing-indicator style="width: {themed_token_value(v as any, theme?.spacing ?? null)};"></spacing-indicator>
					<button class="clear-btn" onclick={() => clear_override(v.id)}>
						{#if override}&times;{/if}
					</button>
				{:else}
					<input type="text" bind:value={v.value} />
					<spacing-indicator style="width: {v.value};"></spacing-indicator>
				{/if}
			{/each}
		</spacing-values>
	{/if}
</main>

<style>
	main {
		display: block;
		padding: var(--sp-08) var(--sp-04);
	}

	spacing-values {
		display: grid;
		grid-template-columns: 6rem 5rem 1fr;
		row-gap: var(--sp-02);
		column-gap: var(--sp-02);

		&.has-theme {
			grid-template-columns: 6rem 5rem 1fr 2rem;
		}
	}
	spacing-indicator {
		display: block;
		justify-self: stretch;
		background-color: var(--primary);
		margin: var(--sp-01);
	}

	.overridden {
		border-left: 3px solid var(--success, #0a0);
	}

	.clear-btn {
		color: var(--bg-text-02);
		font-size: 1.2rem;
		&:hover {
			color: var(--error, #e00);
		}
	}
</style>
