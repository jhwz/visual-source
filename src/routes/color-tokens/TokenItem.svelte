<script lang="ts">
	import { contrast_text_color, hex_to_rgb, rgb_to_hex } from '$lib/colors.js';
	import { token_css_name } from '$lib/generate/css';
	import Link from '$lib/icons/Link.svelte';
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
	let value = $derived(themed_token_value(token, theme));
	let rgb = $derived(hex_to_rgb(value));
	let isOverridden = $derived(theme?.tokens.some((o) => o.tokenId === token.id) ?? false);
</script>

<button
	style="--color: {value}; --text: {rgb_to_hex(contrast_text_color(rgb))}"
	class={{ selected, overridden: isOverridden }}
	{onclick}
	draggable="true"
	ondragstart={(e: DragEvent) => {
		if (!e.dataTransfer) return;
		e.dataTransfer.dropEffect = 'move';
		e.dataTransfer.setData('text/plain', `token:${token.id}`);
	}}
	data-tokenid={token.id}
>
	<color-indicator></color-indicator>

	<token-data>
		<token-name>
			{token.name}
		</token-name>

		<token-meta>
			<css-name>
				--{token_css_name(token, spec.color.groups)}
			</css-name>
			<token-link class:linked={!!token.$ref}>
				{#if !token.$ref}
					{token.value}
				{:else}
					{@const parts = token.$ref.split('/')}
					{@const paletteID = parseInt(parts[3])}
					{@const color = parseInt(parts[5])}
					<Link size={14} />

					{find_by_id(spec.color.palettes, paletteID).name} ({color + 1})
				{/if}
			</token-link>
		</token-meta>
		{#if token.description}
			<token-desc>
				{token.description}
			</token-desc>
		{/if}
	</token-data>
</button>

<style>
	:root {
		--height: 3.5rem;
		--padding: var(--sp-01);
	}
	button {
		min-height: var(--height);

		color: var(--text);
		padding: var(--padding);
		border-radius: 8px;
		display: grid;
		align-items: center;
		grid-template-columns: auto 1fr;
		column-gap: var(--sp-04);
		border: 1px solid var(--bg-border);
		user-select: none;
		width: 100%;

		transition: border-color 0.12s ease;

		&:hover {
			border-color: rgb(var(--primary-rgb) / 0.3);
		}

		&.selected {
			border-color: var(--primary);
		}

		&.overridden {
			border-left: 3px solid var(--success);
		}
	}
	token-data {
		display: grid;
	}

	token-name {
		background-color: inherit;
		color: var(--bg-text-01);
		text-align: left;
		border: none;
		white-space: nowrap;
		margin-right: var(--sp-04);
		border-radius: 5px;
	}
	token-link {
		color: #999;
		font-size: x-small;
		display: flex;
		align-items: center;
		gap: var(--sp-01);

		&.linked {
			color: var(--success);
		}
	}

	css-name {
		color: var(--bg-text-02);
		font-size: x-small;
		display: flex;
		align-items: center;
		gap: var(--sp-01);
	}

	token-desc {
		text-align: left;
		font-size: small;
		color: var(--bg-text-01);
	}

	token-meta {
		display: flex;
		gap: var(--sp-04);
	}

	color-indicator {
		display: block;
		background-color: var(--color);
		border-radius: 5px;
		width: calc(var(--height) - 2 * var(--padding));
		height: calc(var(--height) - 2 * var(--padding));
	}
</style>
