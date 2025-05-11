<script lang="ts">
	import { type Token } from '$lib/spec.svelte.js';
	import { dndzone } from 'svelte-dnd-action';
	import { flip } from 'svelte/animate';
	import { SvelteMap } from 'svelte/reactivity';
	import TokenItem from './TokenItem.svelte';

	type Props = {
		selected: SvelteMap<number, Token>;
		tokens: Token[];
		onconsider: (tokens: Token[]) => void;
		onfinalize: (tokens: Token[]) => void;
	};
	let { selected, tokens, onconsider, onfinalize }: Props = $props();

	const flipduration = 150;
</script>

<tokens-grid
	use:dndzone={{ items: tokens }}
	onconsider={(e) => onconsider(e.detail.items)}
	onfinalize={(e) => onfinalize(e.detail.items)}
>
	{#each tokens as token (token.id)}
		{@const active = selected.has(token.id)}
		<div animate:flip={{ duration: flipduration }}>
			<TokenItem
				{token}
				selected={active}
				onclick={() => {
					if (active) selected.delete(token.id);
					else selected.set(token.id, token);
				}}
			/>
		</div>
	{/each}
</tokens-grid>

<style>
	tokens-grid {
		display: grid;
		grid-template-columns: repeat(auto-fit, minmax(15rem, 1fr));
		column-gap: var(--sp-04);
		row-gap: var(--sp-04);
	}
</style>
