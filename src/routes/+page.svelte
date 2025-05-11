<script lang="ts">
	import Button from '$lib/Button.svelte';
	import Plus from '$lib/icons/Plus.svelte';
	import SidePanel from '$lib/SidePanel.svelte';
	import { spec, type Token } from '$lib/spec.svelte.js';
	import { onMount } from 'svelte';
	import { SvelteMap } from 'svelte/reactivity';
	import TokenGrid from './TokenGrid.svelte';

	let selected = new SvelteMap<number, Token>();

	type Group = {
		name: string;
		tokens: Token[];
	};

	function build_groups(): Group[] {
		const ungrouped = spec.tokens.filter((t) =>
			spec.token_groups.every((g) => !g.tokens.includes(t.id))
		);
		return [
			{ name: '', tokens: ungrouped },
			...spec.token_groups.map((g) => ({
				name: g.name,
				tokens: g.tokens.map((id) => spec.tokens.find((t) => t.id === id)!)
			}))
		].filter((g) => g.tokens.length > 0);
	}

	function remove_from_all_groups(tokens: Token[]) {
		for (const g of groups) {
			g.tokens = g.tokens.filter((t1) => !tokens.some((t2) => t1.id === t2.id));
		}
	}

	let groups: Group[] = $state([]);
	onMount(() => {
		groups = build_groups();
	});
</script>

<page-grid>
	<tokens-body>
		{#each groups as g}
			<h3>{g.name}</h3>
			<TokenGrid
				tokens={g.tokens}
				onconsider={(tokens) => {
					remove_from_all_groups(tokens);
					g.tokens = tokens;
				}}
				onfinalize={(tokens) => {
					remove_from_all_groups(tokens);
					g.tokens = tokens;

					spec.tokens = groups.flatMap((g) => g.tokens);
					spec.token_groups = groups
						.map((g) => ({
							name: g.name,
							tokens: g.tokens.map((t) => t.id)
						}))
						.filter((g) => !!g.name && !!g.tokens.length);
					groups = build_groups();
				}}
				{selected}
			/>
		{/each}

		<token-actions>
			<span>
				<Button
					onclick={() => {
						spec.tokens.push({
							id: Math.max(...spec.tokens.map((t) => t.id), 0) + 1,
							name: 'New Token',
							value: '#ffffff'
						});
					}}
					icon={Plus}
				>
					Add Token
				</Button>
			</span>
		</token-actions>
	</tokens-body>

	{#if selected.size > 0}
		<SidePanel>
			{selected.size} selected

			<Button
				onclick={() => {
					const tokens = [...selected.values()];
					for (const g of spec.token_groups) {
						g.tokens = g.tokens.filter((id) => !tokens.some((t2) => id === t2.id));
					}
					spec.token_groups.push({
						name: 'New Group',
						tokens: tokens.map((t) => t.id)
					});
					groups = build_groups();
					selected.clear();
				}}
				icon={Plus}
			>
				Group
			</Button>
		</SidePanel>
	{/if}
</page-grid>

<style>
	page-grid {
		display: grid;
		grid-template-columns: 2fr auto;
		height: 100%;
	}

	h3 {
		margin-top: var(--sp-05);
	}

	tokens-body {
		display: flex;
		flex-direction: column;
		padding: var(--sp-08);
		position: relative;
		overflow-y: auto;
	}

	token-actions {
		position: fixed;
		bottom: var(--sp-04);
		right: var(--sp-04);
		z-index: 10;
	}
</style>
