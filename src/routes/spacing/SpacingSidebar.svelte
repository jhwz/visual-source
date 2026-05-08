<script lang="ts">
	import Button from '$lib/Button.svelte';
	import FormField from '$lib/FormField.svelte';
	import { token_css_name } from '$lib/generate/css';
	import Plus from '$lib/icons/Plus.svelte';
	import {
		spec,
		token_value,
		type Token,
		type ThemeTokenOverride
	} from '$lib/spec.svelte.js';
	import { activeTheme } from '$lib/theme-context.svelte.js';

	type Props = {
		token: Token | null;
		onadd: () => void;
		ondelete: (token: Token) => void;
	};
	let { token, onadd, ondelete }: Props = $props();

	let theme = $derived(activeTheme());

	let override = $derived.by((): ThemeTokenOverride | null => {
		if (!theme || !token) return null;
		return theme.spacing.find((o) => o.tokenId === token.id) ?? null;
	});

	function set_override_value(value: string) {
		if (!theme || !token) return;
		const existing = theme.spacing.find((o) => o.tokenId === token.id);
		if (existing) {
			existing.value = value;
		} else {
			theme.spacing.push({ tokenId: token.id, value });
		}
	}

	function clear_override() {
		if (!theme || !token) return;
		theme.spacing = theme.spacing.filter((o) => o.tokenId !== token.id);
	}

	function create_override() {
		if (!theme || !token) return;
		theme.spacing.push({
			tokenId: token.id,
			value: token_value(token)
		});
	}
</script>

<sidebar-content>
	<sidebar-actions>
		<Button onclick={onadd} icon={Plus}>Add Token</Button>
	</sidebar-actions>

	{#if token}
		<sidebar-divider></sidebar-divider>

		<FormField label="Token Name">
			<input type="text" bind:value={token.name} spellcheck="false" />
		</FormField>

		<FormField label="Value">
			{#if theme}
				{#if override}
					<input
						type="text"
						value={override.value ?? ''}
						spellcheck="false"
						oninput={(e) => set_override_value(e.currentTarget.value)}
					/>
				{:else}
					<input type="text" bind:value={token.value} spellcheck="false" />
				{/if}
			{:else}
				<input type="text" bind:value={token.value} spellcheck="false" />
			{/if}
		</FormField>

		<FormField label="CSS Variable Name">
			<css-name>
				<span>--</span>
				<input
					type="text"
					spellcheck="false"
					value={token_css_name(token, [])}
					onchange={(e) => {
						if (!token) return;
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
			<theme-section>
				<h3>Theme Override</h3>
				{#if override}
					<p class="hint">This token is overridden in the active theme.</p>
					<Button type="secondary" size="sm" onclick={clear_override}>
						Clear Override
					</Button>
				{:else}
					<p class="hint">Using base value.</p>
					<Button type="secondary" size="sm" onclick={create_override}>Override</Button>
				{/if}
			</theme-section>
		{/if}

		<sidebar-spacer></sidebar-spacer>

		<sidebar-delete>
			<Button
				type="destructive"
				size="sm"
				onclick={() => {
					if (token) ondelete(token);
				}}
			>
				Delete Token
			</Button>
		</sidebar-delete>
	{:else}
		<empty-state>
			<p>Select a token to edit its name, value, or CSS variable.</p>
		</empty-state>
	{/if}
</sidebar-content>

<style>
	sidebar-content {
		display: flex;
		flex-direction: column;
		gap: var(--sp-04);
		padding: var(--sp-04) var(--sp-03);
		height: 100%;
		min-height: 0;
	}

	sidebar-actions {
		display: flex;
		flex-direction: column;
		gap: var(--sp-02);
	}

	sidebar-divider {
		display: block;
		height: 1px;
		background-color: var(--bg-border);
	}

	sidebar-spacer {
		flex: 1;
	}

	sidebar-delete {
		display: block;
	}

	css-name {
		display: flex;
		align-items: center;
		gap: var(--sp-01);
		font-family: var(--font-mono);
	}
	css-name span {
		color: var(--bg-text-02);
	}
	css-name input {
		flex: 1;
	}

	theme-section {
		display: flex;
		flex-direction: column;
		gap: var(--sp-02);
	}
	theme-section h3 {
		margin: 0;
		font-size: 0.85rem;
		font-weight: 600;
		color: var(--bg-text-01);
	}
	.hint {
		margin: 0;
		font-size: 0.8rem;
		color: var(--bg-text-02);
	}

	empty-state p {
		margin: 0;
		color: var(--bg-text-02);
		font-size: 0.85rem;
		line-height: 1.4;
	}
</style>
