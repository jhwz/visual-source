<script lang="ts">
	import type { SvelteComponent } from 'svelte';

	export let icon: typeof SvelteComponent<any> | null = null;
	export let disabled = false;
</script>

<button on:click class:icon={!!icon} {disabled}>
	<slot />

	<svelte:component this={icon} />
</button>

<style>
	button {
		display: flex;
		align-items: center;
		gap: var(--sp-02);

		border: none;
		background-color: #333;
		color: #fff;
		border-radius: 5px;
		cursor: pointer;

		white-space: nowrap;

		font-size: 0.9rem;
		padding: var(--sp-02) var(--sp-04);
	}
	button:disabled {
		color: #888;
		cursor: not-allowed;
	}

	button:not(:disabled):hover {
		background-color: #444;
	}
</style>
