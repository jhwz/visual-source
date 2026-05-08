<script lang="ts">
	import { type Token } from '$lib/spec.svelte.js';
	import { flip } from 'svelte/animate';
	import TokenItem from './TokenItem.svelte';

	type Props = {
		groupselected: boolean;
		tokens: Token[];
		ondrop: (id: number, targetID: number | null) => void;
		ongroupdrop: (groupidx: number) => void;
		selected: (t: Token) => boolean;
		onclick: (t: Token) => void;
	};
	let { selected, tokens, ondrop, onclick, ongroupdrop, groupselected }: Props = $props();

	const flipduration = 150;
	let dragcount = $state(0);
</script>

<tokens-grid
	role="region"
	class={{ dragging: dragcount > 0, selected: groupselected }}
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
		if (!data) return;

		if (data.startsWith('group:')) {
			const idx = parseInt(data.slice(6));
			ongroupdrop(idx);
		} else if (data.startsWith('token:')) {
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
		}
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
		grid-template-columns: repeat(auto-fit, minmax(20rem, 1fr));
		column-gap: var(--sp-02);
		row-gap: var(--sp-01);
		border: 1px solid var(--bg-border);
		border-radius: var(--radius-lg);
		padding: var(--sp-02);
		transition: border-color 0.12s ease;
		&.dragging {
			border-color: var(--primary-hover);
		}
		&.selected {
			border-color: var(--primary);
		}
	}
</style>
