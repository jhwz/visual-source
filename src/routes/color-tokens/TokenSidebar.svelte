<script lang="ts">
	import Button from '$lib/Button.svelte';
	import FormField from '$lib/FormField.svelte';
	import { token_css_name } from '$lib/generate/css';
	import { spec, token_value, type Token, type ThemeTokenOverride } from '$lib/spec.svelte';
	import { activeTheme } from '$lib/theme-context.svelte.js';
	import TokenColor from './TokenColor.svelte';

	type Props = {
		token: Token;
		ondelete: () => void;
	};
	let { token = $bindable(), ondelete }: Props = $props();

	let theme = $derived(activeTheme());

	let override = $derived.by((): ThemeTokenOverride | null => {
		if (!theme) return null;
		return theme.tokens.find((o) => o.tokenId === token.id) ?? null;
	});

	// A proxy token that reads/writes through the override when a theme is active
	let editToken = $derived.by((): Token => {
		if (!override) return token;
		return {
			id: token.id,
			name: token.name,
			description: token.description,
			value: override.value,
			$ref: override.$ref,
			css: token.css
		};
	});

	function create_override() {
		if (!theme) return;
		const value = token_value(token);
		theme.tokens.push({
			tokenId: token.id,
			value
		});
	}

	function clear_override() {
		if (!theme) return;
		theme.tokens = theme.tokens.filter((o) => o.tokenId !== token.id);
	}
</script>

<side-panel-content>
	<FormField label="Token Name">
		<input type="text" bind:value={token.name} />
	</FormField>

	<FormField label="Description">
		<textarea bind:value={token.description} rows="3"></textarea>
	</FormField>

	<FormField label="CSS Variable Name">
		<css-name>
			<span>--</span>
			<input
				type="text"
				spellcheck="false"
				value={token_css_name(token, spec.color.groups)}
				onchange={(e) => {
					const value = e.currentTarget.value;
					if (!value && token.css) token.css.name = undefined;
					else {
						token.css ||= {};
						token.css.name = value;
					}
				}}
			/>
		</css-name>
	</FormField>

	{#if theme}
		<section>
			<h3>Theme Override</h3>
			{#if override}
				<TokenColor token={editToken} onchange={(t) => {
					if (!override) return;
					override.value = t.value;
					override.$ref = t.$ref;
				}} />
				<Button onclick={clear_override} type="error">Clear Override</Button>
			{:else}
				<p class="inherited">Using base value</p>
				<Button onclick={create_override}>Override</Button>
			{/if}
		</section>
	{:else}
		<section>
			<h3>Color</h3>
			<TokenColor bind:token />
		</section>
	{/if}

	<delete-token>
		<Button onclick={ondelete} type="error">Delete</Button>
	</delete-token>
</side-panel-content>

<style>
	side-panel-content {
		display: flex;
		flex-direction: column;
		gap: var(--sp-04);
		padding: var(--sp-04) var(--sp-03);
	}

	section {
		margin-top: var(--sp-04);
	}

	delete-token {
		display: block;
		margin-top: auto;
	}
</style>
