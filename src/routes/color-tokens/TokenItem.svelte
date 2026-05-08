<script lang="ts">
	import { hex_to_rgb } from '$lib/colors.js';
	import CopyableText from '$lib/CopyableText.svelte';
	import { token_css_name } from '$lib/generate/css';
	import Link from '$lib/icons/Link.svelte';
	import ListRow from '$lib/ListRow.svelte';
	import { spec, themed_token_value, type Token } from '$lib/spec.svelte.js';
	import { activeTheme } from '$lib/theme-context.svelte.js';
	import { find_by_id } from '$lib/utils';

	type Props = {
		token: Token;
		onclick: () => void;
		selected: boolean;
	};
	let { token, onclick, selected }: Props = $props();

	let theme = $derived(activeTheme());
	let value = $derived(themed_token_value(token, theme?.tokens ?? null));
	let rgb = $derived(hex_to_rgb(value));
	let isOverridden = $derived(theme?.tokens.some((o) => o.tokenId === token.id) ?? false);
	let cssName = $derived(`--${token_css_name(token, spec.color.groups)}`);
	let linked = $derived.by(() => {
		if (!token.$ref) return null;
		const parts = token.$ref.split('/');
		const paletteID = parseInt(parts[3]);
		const colorIndex = parseInt(parts[5]);
		return {
			name: find_by_id(spec.color.palettes, paletteID).name,
			index: colorIndex + 1
		};
	});
</script>

<!-- svelte-ignore a11y_no_static_element_interactions -->
<token-row
	class:overridden={isOverridden}
	style="--swatch-color: {value}; --swatch-rgb: {rgb[0]} {rgb[1]} {rgb[2]}"
	draggable="true"
	ondragstart={(e: DragEvent) => {
		if (!e.dataTransfer) return;
		e.dataTransfer.dropEffect = 'move';
		e.dataTransfer.setData('text/plain', `token:${token.id}`);
	}}
	data-tokenid={token.id}
>
	<ListRow {selected} {onclick}>
		{#snippet leading()}
			<color-swatch aria-hidden="true"></color-swatch>
		{/snippet}
		{#snippet title()}
			<token-name>{token.name}</token-name>
		{/snippet}
		{#snippet subtitle()}
			{#if value}
				<hex-value>
					<CopyableText value={value} label="Copy hex value" />
				</hex-value>
			{/if}
			{#if linked}
				<token-link>
					<Link size={12} />
					<span>{linked.name} ({linked.index})</span>
				</token-link>
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

	color-swatch {
		display: block;
		width: 28px;
		height: 28px;
		border-radius: var(--radius-sm);
		background-color: var(--swatch-color);
		box-shadow: inset 0 0 0 1px rgb(0 0 0 / 0.06);
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

	hex-value :global(.copyable) {
		color: var(--bg-text-01);
		font-weight: 500;
	}

	css-name {
		display: inline-flex;
		min-width: 0;
		overflow: hidden;
	}

	token-link {
		display: inline-flex;
		align-items: center;
		gap: var(--sp-01);
		color: var(--success);
		font-size: 0.75rem;
		padding: var(--sp-0p5) var(--sp-01);
	}
</style>
