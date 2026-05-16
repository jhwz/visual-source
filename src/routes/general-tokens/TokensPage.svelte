<script lang="ts">
	import { untrack } from 'svelte';
	import { autoscroller } from '$lib/autoscroller';
	import Button from '$lib/Button.svelte';
	import Plus from '$lib/icons/Plus.svelte';
	import PageHeader from '$lib/PageHeader.svelte';
	import PageShell from '$lib/PageShell.svelte';
	import { move_token as move_token_in_groups } from '$lib/move';
	import { cleanup_token_overrides } from '$lib/operations';
	import { spec, type Token } from '$lib/spec.svelte.js';
	import { next_id } from '$lib/utils';
	import type { build_groups } from './general_tokens';
	import GroupSidebar from './GroupSidebar.svelte';
	import TokenGrid from './TokenGrid.svelte';
	import TokenSidebar from './TokenSidebar.svelte';

	let _ = autoscroller;

	type Groups = ReturnType<typeof build_groups>;
	type Props = {
		groups: Groups;
	};

	let { groups: externalgroups = $bindable() }: Props = $props();

	const groups: Groups = $state(externalgroups);

	$effect.pre(() => {
		const ext = externalgroups;
		const extTokens = ext.flatMap((g) => g.tokens).length;
		if (extTokens > 0 && untrack(() => groups.flatMap((g) => g.tokens).length) === 0) {
			groups.length = 0;
			groups.push(...$state.snapshot(ext));
		}
	});

	$effect(() => {
		externalgroups = groups;
	});

	const alltokens = $derived(groups.flatMap((g) => g.tokens));

	let selected: Token | number | null = $state(null);

	function add_token() {
		const token: Token = {
			id: next_id(alltokens),
			name: 'New Token',
			value: '0px'
		};
		const tokens = groups[0].tokens;
		tokens.push(token);
		selected = tokens[tokens.length - 1];
	}

	function add_group() {
		groups.push({
			id: next_id(groups),
			name: 'New Group',
			tokens: []
		});
		selected = groups.length - 1;
	}

	function remove_token(id: number) {
		for (const g of groups) {
			g.tokens = g.tokens.filter((t1) => t1.id !== id);
		}
		cleanup_token_overrides(spec, 'general', id);
	}

	function remove_empty_groups() {
		for (let i = 1; i < groups.length; i++) {
			if (!groups[i].tokens.length) {
				groups.splice(i, 1);
				i--;
			}
		}
	}

	function move_token(id: number, targetIndex: number) {
		move_token_in_groups(groups, id, targetIndex);
		remove_empty_groups();
	}

	function group_index_of(id: number) {
		return groups.findIndex((g) => g.tokens.some((t) => t.id === id));
	}
</script>

<PageShell>
	{#snippet header()}
		<PageHeader
			title="General Tokens"
			description="Radii, sizes, transitions, and other tokens that don't fit color or spacing."
		>
			{#snippet actions()}
				<Button onclick={add_group} icon={Plus} type="secondary" size="sm">Create Group</Button>
				<Button onclick={add_token} icon={Plus} type="primary" size="sm">New Token</Button>
			{/snippet}
		</PageHeader>
	{/snippet}

	{#snippet main()}
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
						{#if i === 0}
							<token-group-header class="ungrouped">
								<h3>Ungrouped</h3>
							</token-group-header>
						{:else}
							<token-group-header>
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
									<h3>{g.name || 'Untitled Group'}</h3>
								</button>
								{#if g.description}
									<p>{g.description}</p>
								{/if}
							</token-group-header>
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
								const position = g.tokens.findIndex((t) => t.id === targetID);
								if (position >= 0) {
									move_token_in_groups(groups, id, i, position);
								} else if (!g.tokens.some((t) => t.id === id)) {
									move_token_in_groups(groups, id, i);
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
	{/snippet}

	{#snippet aside()}
		{#if selected !== null}
			{#if typeof selected === 'number'}
				{@const idx = selected}
				<GroupSidebar
					bind:group={groups[selected]}
					ontokenadd={() => {
						const token: Token = {
							id: next_id(alltokens),
							name: 'New Token',
							value: '0px'
						};
						const tokens = groups[idx].tokens;
						tokens.push(token);
						selected = tokens[tokens.length - 1];
					}}
					onduplicate={() => {
						const source = $state.snapshot(groups[idx]);
						const allIds = alltokens.map((t) => t.id);
						let nextTokenId = Math.max(0, ...allIds) + 1;
						const clonedTokens: Token[] = source.tokens.map((t) => ({
							...t,
							id: nextTokenId++
						}));
						const cloned = {
							...source,
							id: next_id(groups),
							name: source.name ? `${source.name} Copy` : 'New Group',
							tokens: clonedTokens
						};
						groups.splice(idx + 1, 0, cloned);
						selected = idx + 1;
					}}
					ondelete={() => {
						const removedIds = groups[idx].tokens.map((t) => t.id);
						groups.splice(idx, 1);
						for (const id of removedIds) cleanup_token_overrides(spec, 'general', id);
						selected = null;
					}}
				/>
			{:else}
				{@const token = selected}
				{@const tokenGroupIndex = group_index_of(token.id)}
				<TokenSidebar
					bind:token={selected}
					{groups}
					currentGroupIndex={tokenGroupIndex}
					onmove={(target) => move_token(token.id, target)}
					ondelete={() => {
						remove_token(token.id);
						selected = null;
						remove_empty_groups();
					}}
				/>
			{/if}
		{/if}
	{/snippet}
</PageShell>

<style>
	tokens-body {
		display: flex;
		flex-direction: column;
		gap: var(--sp-06);
		padding: var(--sp-06) var(--sp-08);
		position: relative;
	}

	token-group {
		display: block;
	}

	token-group-header {
		display: block;
		margin-bottom: var(--sp-02);
	}

	token-group-header h3 {
		margin: 0;
		font-size: 0.95rem;
		font-weight: 600;
		color: var(--bg-text-01);
	}

	token-group-header.ungrouped h3 {
		color: var(--bg-text-02);
		font-weight: 500;
	}

	token-group-header button {
		background: transparent;
		border: none;
		padding: 0;
		cursor: pointer;
		color: inherit;
		transition: color 0.15s ease;
	}

	token-group-header button:hover {
		color: rgb(var(--primary-hover-rgb) / 0.6);
	}

	token-group-header button.selected {
		color: var(--primary);
	}

	token-group-header p {
		color: var(--bg-text-02);
		font-size: 0.8rem;
		margin: var(--sp-01) 0 0 0;
	}
</style>
