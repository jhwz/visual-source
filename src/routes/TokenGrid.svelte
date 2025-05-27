<script lang="ts">
	import { type Token } from '$lib/spec.svelte.js';
	import { flip } from 'svelte/animate';
	import TokenItem from './TokenItem.svelte';

	type Props = {
		tokens: Token[];
		ondrop: (id: number, targetID: number | null) => void;
		selected: (t: Token) => boolean;
		onclick: (t: Token) => void;
	};
	let { selected, tokens, ondrop, onclick }: Props = $props();

	const flipduration = 150;
	let dragcount = $state(0);
</script>

<tokens-grid
	role="region"
	class={{ dragging: dragcount > 0 }}
	ondragover={(e: DragEvent) => {
		e.preventDefault();
	}}
	ondragenter={() => {
		dragcount++;
	}}
	ondragleave={() => {
		dragcount--;
	}}
	ondrop={(e: DragEvent & { currentTarget: HTMLElement }) => {
		dragcount = 0;
		const data = e.dataTransfer?.getData('text/plain');
		if (!data || !data.startsWith('token:')) return;
		let target = e.target;
		let targetID: number | null = null;
		while (target && target instanceof HTMLElement && target !== e.currentTarget) {
			if (target.dataset.tokenid) {
				targetID = parseInt(target.dataset.tokenid);
				break;
			}
			target = target.parentElement;
		}

		const id = parseInt(data.slice(6));
		ondrop(id, targetID);
	}}
>
	{#each tokens as token (token.id)}
		{@const active = selected(token)}
		<div animate:flip={{ duration: flipduration }}>
			<TokenItem {token} selected={active} onclick={() => onclick(token)} />
		</div>
	{/each}
</tokens-grid>

<style>
	tokens-grid {
		display: grid;
		grid-template-columns: repeat(auto-fit, minmax(15rem, 1fr));
		column-gap: var(--sp-04);
		row-gap: var(--sp-04);
		border: 1px solid black;
		padding: var(--sp-04);
		&.dragging {
			border-color: red;
		}
	}
</style>
