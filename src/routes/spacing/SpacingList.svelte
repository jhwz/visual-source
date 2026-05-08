<script lang="ts">
	import { themed_token_value, type Token } from '$lib/spec.svelte.js';
	import { activeTheme } from '$lib/theme-context.svelte.js';
	import SpacingRow from './SpacingRow.svelte';
	import { parse_px } from './spacing';

	type Props = {
		tokens: Token[];
		selectedId: number | null;
		onselect: (token: Token) => void;
	};
	let { tokens, selectedId, onselect }: Props = $props();

	let theme = $derived(activeTheme());

	let maxValuePx = $derived.by(() => {
		let max = 0;
		for (const t of tokens) {
			const px = parse_px(themed_token_value(t, theme?.spacing ?? null));
			if (px > max) max = px;
		}
		return max;
	});
</script>

<spacing-list>
	{#each tokens as token (token.id)}
		<SpacingRow
			{token}
			{maxValuePx}
			selected={selectedId === token.id}
			onclick={() => onselect(token)}
		/>
	{/each}
</spacing-list>

<style>
	spacing-list {
		display: flex;
		flex-direction: column;
		gap: var(--sp-01);
		padding: var(--sp-04) var(--sp-06);
	}
</style>
