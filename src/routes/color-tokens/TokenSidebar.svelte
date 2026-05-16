<script lang="ts">
	import Button from '$lib/Button.svelte';
	import ConfirmDialog from '$lib/ConfirmDialog.svelte';
	import CopyableText from '$lib/CopyableText.svelte';
	import FormField from '$lib/FormField.svelte';
	import { token_css_name } from '$lib/generate/css';
	import Trash from '$lib/icons/Trash.svelte';
	import MoveToMenu from '$lib/MoveToMenu.svelte';
	import {
		spec,
		themed_token_value,
		token_value,
		type Token,
		type ThemeTokenOverride
	} from '$lib/spec.svelte';
	import { activeTheme } from '$lib/theme-context.svelte.js';
	import TokenColor from './TokenColor.svelte';

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

	let cssName = $derived(`--${token_css_name(token, spec.color.groups)}`);
	let displayValue = $derived(themed_token_value(token, theme?.tokens ?? null));

	let confirmDeleteOpen = $state(false);

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
	<sidebar-summary>
		<CopyableText value={cssName} label="Copy CSS variable name" />
		{#if displayValue}
			<CopyableText value={displayValue} label="Copy hex value" />
		{/if}
	</sidebar-summary>

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
				<TokenColor
					token={editToken}
					onchange={(t) => {
						if (!override) return;
						override.value = t.value;
						override.$ref = t.$ref;
					}}
				/>
				<Button onclick={clear_override} type="destructive" size="sm">Clear Override</Button>
			{:else}
				<p class="inherited">Using base value</p>
				<Button onclick={create_override} type="secondary" size="sm">Override</Button>
			{/if}
		</section>
	{:else}
		<section>
			<h3>Color</h3>
			<TokenColor bind:token />
		</section>
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

	section {
		margin-top: var(--sp-04);
		display: flex;
		flex-direction: column;
		align-items: flex-start;
		gap: var(--sp-02);
	}

	section h3 {
		margin: 0;
	}

	token-actions {
		display: flex;
		flex-wrap: wrap;
		gap: var(--sp-02);
		margin-top: auto;
	}

	.inherited {
		color: var(--bg-text-02);
		font-size: 0.85rem;
		margin: 0;
	}
</style>
