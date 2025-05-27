<script lang="ts">
	import Button from '$lib/Button.svelte';
	import FormField from '$lib/FormField.svelte';
	import Plus from '$lib/icons/Plus.svelte';
	import SidePanel from '$lib/SidePanel.svelte';
	import { spec, type Token } from '$lib/spec.svelte.js';
	import { onMount } from 'svelte';
	import TokenColor from './TokenColor.svelte';
	import TokenGrid from './TokenGrid.svelte';

	let selected: Token | number | null = $state(null);

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
		];
	}

	let groups: Group[] = $state([]);
	onMount(() => {
		groups = build_groups();
	});
	$effect(() => {
		if (groups.length) {
			spec.tokens = groups.flatMap((g) => g.tokens);
			spec.token_groups = groups
				.slice(1)
				.map((g) => ({ name: g.name, tokens: g.tokens.map((t) => t.id) }));
		}
	});

	function remove_token(id: number) {
		for (const g of groups) {
			g.tokens = g.tokens.filter((t1) => t1.id !== id);
		}
	}
</script>

<page-grid>
	<!-- svelte-ignore a11y_click_events_have_key_events,a11y_no_static_element_interactions -->
	<tokens-body
		onclick={(e: MouseEvent) => {
			if (e.currentTarget === e.target) {
				selected = null;
			}
		}}
	>
		{#each groups as g, i}
			{@const active = typeof selected === 'number' && selected === i}
			{@const token_active = (t: Token) => typeof selected === 'object' && t.id === selected?.id}
			<token-group>
				{#if g.name}
					<button
						class={{ selected: active }}
						onclick={() => {
							if (active) selected = null;
							else selected = i;
						}}
					>
						<h3>{g.name}</h3>
					</button>
				{/if}
				<TokenGrid
					tokens={g.tokens}
					selected={token_active}
					onclick={(t) => {
						if (token_active(t)) selected = null;
						else selected = t;
					}}
					ondrop={(id, targetID) => {
						const token = spec.tokens.find((t) => t.id === id);
						if (!token) return;
						remove_token(id);
						const index = g.tokens.findIndex((t) => t.id === targetID);
						if (index >= 0) g.tokens.splice(index, 0, token);
						else g.tokens.push(token);
						for (let i = 1; i < groups.length; i++) {
							if (!groups[i].tokens.length) {
								groups.splice(i, 1);
								i--;
							}
						}
					}}
				/>
			</token-group>
		{/each}

		{#if !selected}
			<token-actions>
				<Button
					onclick={() => {
						groups.push({ name: 'New Group', tokens: [] });
						selected = groups.length - 1;
					}}
					icon={Plus}
				>
					Add Group
				</Button>
				<Button
					onclick={() => {
						groups[0].tokens.push({
							id: Math.max(...spec.tokens.map((t) => t.id), 0) + 1,
							name: 'New Token',
							value: '#ffffff'
						});
						selected = groups[0].tokens.at(-1)!;
					}}
					icon={Plus}
				>
					Add Token
				</Button>
			</token-actions>
		{/if}
	</tokens-body>

	{#if selected !== null}
		{#if typeof selected === 'number'}
			{@const group = groups[selected]}
			<SidePanel>
				<side-panel-content>
					<FormField label="Name">
						<input type="text" bind:value={group.name} />
					</FormField>
				</side-panel-content>
			</SidePanel>
		{:else}
			{@const token = selected}
			<SidePanel>
				<side-panel-content>
					<FormField label="Token Name">
						<input type="text" bind:value={selected.name} />
					</FormField>

					<h3>Color</h3>
					<TokenColor bind:token={selected} />

					<Button
						onclick={() => {
							remove_token(token.id);
							selected = null;
						}}
					>
						Delete
					</Button>
				</side-panel-content>
			</SidePanel>
		{/if}
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
		display: flex;
		gap: var(--sp-02);
	}

	token-group {
		display: block;
		button {
			&.selected {
				color: blue;
			}
		}
	}

	side-panel-content {
		display: block;
		padding: var(--sp-04) var(--sp-03);
	}
</style>
