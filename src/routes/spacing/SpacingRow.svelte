<script lang="ts">
	import CopyableText from '$lib/CopyableText.svelte';
	import { token_css_name } from '$lib/generate/css';
	import ListRow from '$lib/ListRow.svelte';
	import { themed_token_value, type Token } from '$lib/spec.svelte.js';
	import { activeTheme } from '$lib/theme-context.svelte.js';
	import { parse_px } from './spacing';

	type Props = {
		token: Token;
		selected: boolean;
		onclick: () => void;
		/** Maximum value (in px) across the scale, used to scale the bar. */
		maxValuePx: number;
	};
	let { token, selected, onclick, maxValuePx }: Props = $props();

	let theme = $derived(activeTheme());
	let value = $derived(themed_token_value(token, theme?.spacing ?? null));
	let isOverridden = $derived(theme?.spacing.some((o) => o.tokenId === token.id) ?? false);
	let cssName = $derived(`--${token_css_name(token, [])}`);

	let pxValue = $derived(parse_px(value));
	let widthPercent = $derived(maxValuePx > 0 ? (pxValue / maxValuePx) * 100 : 0);
</script>

<spacing-row class:overridden={isOverridden}>
	<ListRow {selected} {onclick}>
		{#snippet title()}
			<row-name>{token.name}</row-name>
		{/snippet}
		{#snippet subtitle()}
			<CopyableText value={cssName} label="Copy CSS variable name" />
			<row-value>{value}</row-value>
		{/snippet}
		{#snippet trailing()}
			<bar-track aria-hidden="true">
				<bar-fill style="width: {widthPercent}%;"></bar-fill>
			</bar-track>
		{/snippet}
	</ListRow>
</spacing-row>

<style>
	spacing-row {
		display: block;
		position: relative;
		border-radius: var(--radius-md);
	}
	spacing-row.overridden::before {
		content: '';
		position: absolute;
		left: 0;
		top: 6px;
		bottom: 6px;
		width: 3px;
		background-color: var(--success);
		border-radius: 2px;
		pointer-events: none;
		z-index: 1;
	}

	row-name {
		display: inline-block;
		font-family: var(--font-mono);
		font-size: 0.85rem;
		color: var(--bg-text-01);
		line-height: 1.25;
	}

	row-value {
		display: inline-block;
		font-family: var(--font-mono);
		font-size: 0.75rem;
		color: var(--bg-text-02);
	}

	bar-track {
		display: block;
		position: relative;
		width: 16rem;
		height: 0.75rem;
		background-color: transparent;
	}

	bar-fill {
		display: block;
		position: absolute;
		left: 0;
		top: 0;
		bottom: 0;
		background-color: var(--primary);
		border-radius: var(--radius-sm);
		transition: width 0.15s ease;
	}
</style>
