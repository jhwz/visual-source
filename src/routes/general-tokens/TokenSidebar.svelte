<script lang="ts">
	import Button from '$lib/Button.svelte';
	import ConfirmDialog from '$lib/ConfirmDialog.svelte';
	import CopyableText from '$lib/CopyableText.svelte';
	import FormField from '$lib/FormField.svelte';
	import { token_css_name } from '$lib/generate/css';
	import Trash from '$lib/icons/Trash.svelte';
	import MoveToMenu from '$lib/MoveToMenu.svelte';
	import { themes as themes_ops } from '$lib/operations';
	import {
		spec,
		themed_token_value,
		token_value,
		type Token,
		type ThemeTokenOverride
	} from '$lib/spec.svelte';
	import { activeTheme } from '$lib/theme-context.svelte.js';

	type Props = {
		token: Token;
		ondelete: () => void;
		groups: { name: string }[];
		currentGroupIndex: number;
		onmove: (targetIndex: number) => void;
	};
	let {
		token = $bindable(),
		ondelete,
		groups,
		currentGroupIndex,
		onmove
	}: Props = $props();

	let theme = $derived(activeTheme());

	let override = $derived.by((): ThemeTokenOverride | null => {
		if (!theme) return null;
		return theme.general?.find((o) => o.tokenId === token.id) ?? null;
	});

	let cssName = $derived(`--${token_css_name(token, [])}`);
	let displayValue = $derived(themed_token_value(token, theme?.general ?? null));

	let confirmDeleteOpen = $state(false);

	function set_override_value(value: string) {
		if (!theme) return;
		themes_ops.set_override(spec, theme.id, 'general', token.id, { value });
	}

	function create_override() {
		if (!theme) return;
		themes_ops.set_override(spec, theme.id, 'general', token.id, { value: token_value(token) });
	}

	function clear_override() {
		if (!theme) return;
		themes_ops.clear_override(spec, theme.id, 'general', token.id);
	}
</script>

<side-panel-content>
	<sidebar-summary>
		<CopyableText value={cssName} label="Copy CSS variable name" />
		{#if displayValue}
			<CopyableText value={displayValue} label="Copy value" />
		{/if}
	</sidebar-summary>

	<FormField label="Token Name">
		<input type="text" bind:value={token.name} spellcheck="false" />
	</FormField>

	<FormField label="Description">
		<textarea bind:value={token.description} rows="3"></textarea>
	</FormField>

	<FormField label="Value">
		{#if theme && override}
			<input
				type="text"
				value={override.value ?? ''}
				spellcheck="false"
				oninput={(e) => set_override_value(e.currentTarget.value)}
			/>
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
				<Button type="secondary" size="sm" onclick={clear_override}>Clear Override</Button>
			{:else}
				<p class="hint">Using base value.</p>
				<Button type="secondary" size="sm" onclick={create_override}>Override</Button>
			{/if}
		</theme-section>
	{/if}

	<token-actions>
		<MoveToMenu {groups} currentIndex={currentGroupIndex} {onmove} />
		<Button
			onclick={() => {
				confirmDeleteOpen = true;
			}}
			type="destructive"
			size="sm"
			icon={Trash}
		>
			Delete
		</Button>
	</token-actions>
</side-panel-content>

<ConfirmDialog
	bind:open={confirmDeleteOpen}
	title="Delete token?"
	message="Delete the '{token.name}' token? This can't be undone."
	variant="destructive"
	onconfirm={ondelete}
/>

<style>
	side-panel-content {
		display: flex;
		flex-direction: column;
		gap: var(--sp-04);
		padding: var(--sp-04) var(--sp-03);
	}

	sidebar-summary {
		display: flex;
		flex-wrap: wrap;
		gap: var(--sp-01);
		align-items: center;
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

	token-actions {
		display: flex;
		flex-wrap: wrap;
		gap: var(--sp-02);
		margin-top: auto;
	}
</style>
