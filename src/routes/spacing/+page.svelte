<script lang="ts">
	import Button from '$lib/Button.svelte';
	import ConfirmDialog from '$lib/ConfirmDialog.svelte';
	import Plus from '$lib/icons/Plus.svelte';
	import PageHeader from '$lib/PageHeader.svelte';
	import PageShell from '$lib/PageShell.svelte';
	import { spec, type Token } from '$lib/spec.svelte.js';
	import { next_id } from '$lib/utils';
	import Presets from './Presets.svelte';
	import SpacingList from './SpacingList.svelte';
	import SpacingSidebar from './SpacingSidebar.svelte';

	let selectedId: number | null = $state(null);
	let pendingDelete: Token | null = $state(null);

	let selectedToken = $derived.by((): Token | null => {
		if (selectedId == null) return null;
		return spec.spacing.scale.find((t) => t.id === selectedId) ?? null;
	});

	function add_token() {
		const id = next_id(spec.spacing.scale);
		const token: Token = {
			id,
			name: `sp-${String(spec.spacing.scale.length + 1).padStart(2, '0')}`,
			value: '16px'
		};
		spec.spacing.scale.push(token);
		selectedId = id;
	}

	function delete_token(token: Token) {
		spec.spacing.scale = spec.spacing.scale.filter((t) => t.id !== token.id);
		// Clean up theme overrides that referenced this token.
		for (const theme of spec.themes) {
			theme.spacing = theme.spacing.filter((o) => o.tokenId !== token.id);
		}
		if (selectedId === token.id) selectedId = null;
	}
</script>

<PageShell>
	{#snippet header()}
		<PageHeader
			title="Spacing Tokens"
			description="Define a spacing scale used across your design system."
		>
			{#snippet actions()}
				<Button onclick={add_token} icon={Plus} type="primary" size="sm">Add Token</Button>
			{/snippet}
		</PageHeader>
	{/snippet}

	{#snippet main()}
		{#if !spec.spacing.scale?.length}
			<empty-main>
				<Presets />
			</empty-main>
		{:else}
			<SpacingList
				tokens={spec.spacing.scale}
				{selectedId}
				onselect={(t) => {
					selectedId = selectedId === t.id ? null : t.id;
				}}
			/>
		{/if}
	{/snippet}

	{#snippet aside()}
		{#if selectedToken}
			<SpacingSidebar
				token={selectedToken}
				ondelete={(t) => {
					pendingDelete = t;
				}}
			/>
		{/if}
	{/snippet}
</PageShell>

<ConfirmDialog
	open={pendingDelete !== null}
	title="Delete spacing token?"
	message={pendingDelete
		? `Delete '${pendingDelete.name}'? Tokens that reference it may break.`
		: ''}
	confirmLabel="Delete"
	variant="destructive"
	onconfirm={() => {
		if (pendingDelete) delete_token(pendingDelete);
		pendingDelete = null;
	}}
	oncancel={() => {
		pendingDelete = null;
	}}
/>

<style>
	empty-main {
		display: block;
		padding: var(--sp-08) var(--sp-06);
	}
</style>
