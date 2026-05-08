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

	/** Generate "nice" tick positions (px values) up to and including the max. */
	let ticks = $derived.by(() => {
		if (maxValuePx <= 0) return [];
		const candidates = [16, 32, 64, 128, 256, 384, 512, 768, 1024];
		const visible = candidates.filter((c) => c <= maxValuePx);
		return visible.map((px) => ({
			px,
			percent: (px / maxValuePx) * 100
		}));
	});
</script>

<spacing-list>
	<spacing-list-axis aria-hidden="true">
		{#each ticks as tick (tick.px)}
			<spacing-tick style="left: {tick.percent}%;">
				<tick-label>{tick.px}px</tick-label>
			</spacing-tick>
		{/each}
	</spacing-list-axis>

	<spacing-list-rows>
		{#each tokens as token (token.id)}
			<SpacingRow
				{token}
				{maxValuePx}
				selected={selectedId === token.id}
				onclick={() => onselect(token)}
			/>
		{/each}
	</spacing-list-rows>
</spacing-list>

<style>
	spacing-list {
		display: block;
		position: relative;
		padding: var(--sp-04) var(--sp-06);
	}

	/*
	 * Axis ticks live behind the rows. The axis spans only the trailing bar
	 * column on each row (16rem, matching SpacingRow's bar-track), aligned to
	 * the right edge so ticks line up with the bars regardless of row width.
	 */
	spacing-list-axis {
		position: absolute;
		top: var(--sp-04);
		bottom: var(--sp-04);
		right: calc(var(--sp-06) + var(--sp-02));
		width: 16rem;
		pointer-events: none;
	}

	spacing-tick {
		position: absolute;
		top: 0;
		bottom: 0;
		width: 1px;
		background-color: var(--bg-border);
		opacity: 0.5;
	}

	tick-label {
		position: absolute;
		bottom: -1.25rem;
		left: 0;
		transform: translateX(-50%);
		font-family: var(--font-mono);
		font-size: 0.65rem;
		color: var(--bg-text-02);
		opacity: 0.7;
		white-space: nowrap;
	}

	spacing-list-rows {
		display: flex;
		flex-direction: column;
		gap: var(--sp-01);
		position: relative;
	}
</style>
