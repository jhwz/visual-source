<script lang="ts">
	import { contrast_text_color, hex_to_rgb, rgb_to_hex } from '$lib/colors.js';
	import Link from '$lib/icons/Link.svelte';
	import { spec, token_value, type Token } from '$lib/spec.svelte.js';

	type Props = {
		token: Token;
		onclick: () => void;
		selected: boolean;
	};
	let { token, onclick, selected }: Props = $props();

	let value = $derived(token_value(token));
	let rgb = $derived(hex_to_rgb(value));
</script>

<button
	style="--color: {token.value}; --text: {rgb_to_hex(contrast_text_color(rgb))}"
	class={{ selected }}
	{onclick}
>
	<token-data>
		<token-name>
			{token.name}
		</token-name>

		<token-link class:linked={!!token.$ref}>
			<Link size={14} />
			{#if !token.$ref}
				Link
			{:else}
				{@const parts = token.$ref.split('/')}
				{@const palette = parseInt(parts[2])}
				{@const color = parseInt(parts[4])}
				{spec.palettes[palette].name} ({color + 1})
			{/if}
		</token-link>
	</token-data>

	<input
		type="color"
		{value}
		disabled
		onchange={(e) => {
			token.value = e.currentTarget.value;
		}}
	/>
</button>

<style>
	button {
		color: var(--text);
		padding: var(--sp-01) var(--sp-03);
		border-radius: 5px;
		display: grid;
		align-items: center;
		grid-template-columns: 1fr auto;
		border: 1px solid #ccc;
		user-select: none;
		width: 100%;

		transition: border-color 0.12s ease;

		&:hover {
			border-color: rgb(var(--primary-background-rgb) / 0.3);
		}

		&.selected {
			border-color: var(--primary-background);
		}
	}
	token-data {
		display: grid;
		padding: var(--sp-01) 0;
	}

	token-name {
		background-color: inherit;
		color: var(--background-text-01);
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
			color: #0a0;
		}
	}

	input[type='color'] {
		height: 3rem;
		width: 5rem;
	}
</style>
