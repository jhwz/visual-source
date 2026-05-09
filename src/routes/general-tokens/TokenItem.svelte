<script lang="ts">
	import CopyableText from '$lib/CopyableText.svelte';
	import { token_css_name } from '$lib/generate/css';
	import ListRow from '$lib/ListRow.svelte';
	import { themed_token_value, type Token } from '$lib/spec.svelte.js';
	import { activeTheme } from '$lib/theme-context.svelte.js';

	type Props = {
		token: Token;
		onclick: () => void;
		selected: boolean;
	};
	let { token, onclick, selected }: Props = $props();

	let theme = $derived(activeTheme());
	let value = $derived(themed_token_value(token, theme?.general ?? null));
	let isOverridden = $derived(theme?.general?.some((o) => o.tokenId === token.id) ?? false);
	let cssName = $derived(`--${token_css_name(token, [])}`);
</script>

<!-- svelte-ignore a11y_no_static_element_interactions -->
<token-row
	class:overridden={isOverridden}
	draggable="true"
	ondragstart={(e: DragEvent) => {
		if (!e.dataTransfer) return;
		e.dataTransfer.dropEffect = 'move';
		e.dataTransfer.setData('text/plain', `token:${token.id}`);
	}}
	data-tokenid={token.id}
>
	<ListRow {selected} {onclick}>
		{#snippet title()}
			<token-name>{token.name}</token-name>
		{/snippet}
		{#snippet subtitle()}
			{#if value}
				<token-value>
					<CopyableText value={value} label="Copy value" />
				</token-value>
			{/if}
			<css-name>
				<CopyableText value={cssName} label="Copy CSS variable name" />
			</css-name>
		{/snippet}
	</ListRow>
</token-row>

<style>
	token-row {
		display: block;
		position: relative;
		border-radius: var(--radius-md);
	}
	token-row.overridden::before {
		content: '';
		position: absolute;
		left: 0;
		top: 6px;
		bottom: 6px;
		width: 3px;
		background-color: var(--success);
		border-radius: 2px;
		pointer-events: none;
	}

	token-name {
		display: inline-block;
		color: var(--bg-text-02);
		font-size: 0.85rem;
		font-weight: 500;
		line-height: 1.25;
		overflow: hidden;
		text-overflow: ellipsis;
		white-space: nowrap;
	}

	token-value :global(.copyable) {
		color: var(--bg-text-01);
		font-weight: 500;
	}

	css-name {
		display: inline-flex;
		min-width: 0;
		overflow: hidden;
	}
</style>
