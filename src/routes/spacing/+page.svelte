<script lang="ts">
	import { spec } from '$lib/spec.svelte.js';
	import Presets from './Presets.svelte';
</script>

<h3>Spacing</h3>
<help-text>
	<p>Manage the spacing tokens for your project</p>
</help-text>

{#if !spec.spacing.scale?.length}
	<Presets />
{:else}
	<spacing-values>
		<span>Name</span>
		<span>Value</span>
		<span></span>
		{#each spec.spacing.scale as v}
			<input type="text" bind:value={v.name} />
			<input type="text" bind:value={v.value} />
			<spacing-indicator style="width: {v.value};"></spacing-indicator>
		{/each}
	</spacing-values>
{/if}

<style>
	help-text {
		margin-bottom: var(--sp-08);
		display: block;
	}

	spacing-values {
		display: grid;
		grid-template-columns: 6rem 5rem 1fr;
		row-gap: var(--sp-02);
		column-gap: var(--sp-02);
	}
	spacing-indicator {
		display: block;
		justify-self: stretch;
		background-color: blue;
		margin: var(--sp-01);
	}
</style>
