<script lang="ts">
	import { untrack } from 'svelte';
	import { autoscroller } from '$lib/autoscroller';
	import Button from '$lib/Button.svelte';
	import Plus from '$lib/icons/Plus.svelte';
	import SidePanel from '$lib/SidePanel.svelte';
	import { spec, type Token } from '$lib/spec.svelte.js';
	import { next_id } from '$lib/utils';
	import type { build_groups } from './color-tokens/color_tokens';
	import GroupSidebar from './color-tokens/GroupSidebar.svelte';
	import TokenGrid from './color-tokens/TokenGrid.svelte';
	import TokenSidebar from './color-tokens/TokenSidebar.svelte';

	let _ = autoscroller; // for some reason typescript can't see this import in the attachment..

	type Groups = ReturnType<typeof build_groups>;
	type Props = {
		groups: Groups;
	};

	let { groups: externalgroups = $bindable() }: Props = $props();

	const groups: Groups = $state(externalgroups);

	// Pull: when spec loads asynchronously, externalgroups updates but the
	// one-time $state copy above doesn't. Detect new external data and sync it
	// into local state. untrack on the local read is essential — without it,
	// deleting the last token would trigger the condition and undo the delete
	// (the push effect below hasn't updated spec yet at $effect.pre time).
	$effect.pre(() => {
		const ext = externalgroups;
		const extTokens = ext.flatMap((g) => g.tokens).length;
		if (extTokens > 0 && untrack(() => groups.flatMap((g) => g.tokens).length) === 0) {
			groups.length = 0;
			groups.push(...$state.snapshot(ext));
		}
	});

	// Push: sync local mutations back to parent (triggers the bind setter)
	$effect(() => {
		externalgroups = groups;
	});

	const alltokens = $derived(groups.flatMap((g) => g.tokens));

	let selected: Token | number | null = $state(null);

	function remove_token(id: number) {
		for (const g of groups) {
			g.tokens = g.tokens.filter((t1) => t1.id !== id);
		}
		// Clean up theme overrides for this token
		for (const theme of spec.themes) {
			theme.tokens = theme.tokens.filter((o) => o.tokenId !== id);
		}
	}

	function remove_empty_groups() {
		for (let i = 1; i < groups.length; i++) {
			if (!groups[i].tokens.length) {
				groups.splice(i, 1);
				i--;
			}
		}
	}
</script>

<page-grid>
	<!-- svelte-ignore a11y_click_events_have_key_events,a11y_no_static_element_interactions -->
	<tokens-body
		{@attach autoscroller()}
		onclick={(e: MouseEvent & { currentTarget: HTMLElement }) => {
			if (
				e.currentTarget === e.target ||
				(e.target instanceof HTMLElement && e.target.tagName === 'TOKEN-GROUP')
			) {
				selected = null;
			}
		}}
	>
		{#each groups as g, i}
			{@const active = typeof selected === 'number' && selected === i}
			{@const token_active = (t: Token) => typeof selected === 'object' && t.id === selected?.id}
			{#if i > 0 || g.tokens.length > 0}
				<token-group>
					{#if g.name}
						<button
							class={{ selected: active }}
							onclick={() => {
								if (active) selected = null;
								else selected = i;
							}}
							ondragstart={(e: DragEvent) => {
								if (!e.dataTransfer || i == 0) return;
								e.dataTransfer.dropEffect = 'move';
								e.dataTransfer.setData('text/plain', `group:${i}`);
							}}
							data-groupid={i}
							draggable="true"
						>
							<h3>{g.name}</h3>
						</button>
						{#if g.description}
							<p>{g.description}</p>
						{/if}
					{/if}
					<TokenGrid
						tokens={g.tokens}
						selected={token_active}
						onclick={(t) => {
							if (token_active(t)) selected = null;
							else selected = t;
						}}
						groupselected={active}
						ondrop={(id, targetID) => {
							const token = alltokens.find((t) => t.id === id);
							if (!token) return;
							const index = g.tokens.findIndex((t) => t.id === targetID);
							if (index >= 0) {
								remove_token(id);
								g.tokens.splice(index, 0, token);
							} else if (!g.tokens.some((t) => t.id === id)) {
								remove_token(id);
								g.tokens.push(token);
							}
							remove_empty_groups();
						}}
						ongroupdrop={(idx) => {
							if (i == 0) return;
							groups.splice(i, 0, ...groups.splice(idx, 1));
						}}
					/>
				</token-group>
			{/if}
		{/each}
	</tokens-body>

	<SidePanel>
		{#if selected !== null}
			{#if typeof selected === 'number'}
				{@const idx = selected}
				<GroupSidebar
					bind:group={groups[selected]}
					ontokenadd={() => {
						groups[idx].tokens.push({
							id: Math.max(...alltokens.map((t) => t.id), 0) + 1,
							name: 'New Token',
							value: '#ffffff'
						});
						selected = groups[idx].tokens.at(-1)!;
					}}
					ondelete={() => {
						groups.splice(idx, 1);
						selected = null;
					}}
				/>
			{:else}
				{@const token = selected}
				<TokenSidebar
					bind:token={selected}
					ondelete={() => {
						remove_token(token.id);
						selected = null;
						remove_empty_groups();
					}}
				/>
			{/if}
		{:else}
			<no-selection-sidebar>
				<Button
					onclick={() => {
						groups[0].tokens.push({
							id: next_id(alltokens),
							name: 'New Token',
							value: '#ffffff'
						});
						selected = groups[0].tokens.at(-1)!;
					}}
					icon={Plus}
				>
					Create Token
				</Button>

				<Button
					onclick={() => {
						groups.push({
							id: next_id(groups),
							name: 'New Group',
							tokens: []
						});
						selected = groups.length - 1;
					}}
					icon={Plus}
				>
					Create Group
				</Button>
			</no-selection-sidebar>
		{/if}
	</SidePanel>
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

	token-group {
		display: block;
		button {
			transition: color 0.15s ease;
			&:hover {
				color: rgb(var(--primary-hover-rgb) / 0.6);
			}
			&.selected {
				color: var(--primary);
			}
		}
		p {
			color: var(--bg-text-02);
			font-size: small;
			margin-bottom: var(--sp-01);
		}
	}

	no-selection-sidebar {
		padding: var(--sp-04);
		display: flex;
		flex-direction: column;
		gap: var(--sp-04);
	}
</style>
