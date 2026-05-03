<script lang="ts">
	import Minus from '$lib/icons/Minus.svelte';
	import Plus from '$lib/icons/Plus.svelte';
	import { spec } from '$lib/spec.svelte.js';
	import { themeContext } from '$lib/theme-context.svelte.js';
	import { next_id } from '$lib/utils';

	function add_theme() {
		const id = next_id(spec.themes);
		spec.themes.push({
			id,
			name: `Theme ${spec.themes.length + 1}`,
			tokens: [],
			spacing: []
		});
		themeContext.activeThemeId = id;
	}

	function remove_theme() {
		if (themeContext.activeThemeId == null) return;
		spec.themes = spec.themes.filter((t) => t.id !== themeContext.activeThemeId);
		themeContext.activeThemeId = null;
	}
</script>

<themes-section>
	<theme-header>
		Theme

		<button class="add-theme" onclick={add_theme}>
			<Plus />
		</button>
		{#if themeContext.activeThemeId != null}
			<button class="remove-theme" onclick={remove_theme}>
				<Minus />
			</button>
		{/if}
	</theme-header>

	<select
		value={themeContext.activeThemeId ?? ''}
		onchange={(e) => {
			const val = e.currentTarget.value;
			themeContext.activeThemeId = val === '' ? null : parseInt(val);
		}}
	>
		<option value="">Base</option>
		{#each spec.themes as theme}
			<option value={theme.id}>{theme.name}</option>
		{/each}
	</select>

	{#if themeContext.activeThemeId != null}
		{@const theme = spec.themes.find((t) => t.id === themeContext.activeThemeId)}
		{#if theme}
			<input
				type="text"
				class="theme-name"
				value={theme.name}
				oninput={(e) => {
					theme.name = e.currentTarget.value;
				}}
			/>
		{/if}
	{/if}
</themes-section>

<style>
	themes-section {
		display: flex;
		flex-direction: column;
		gap: var(--sp-01);
		margin-top: var(--sp-02);
	}

	theme-header {
		display: flex;
		color: var(--bg-text-02);
		font-size: small;
		font-weight: bold;
		gap: var(--sp-02);
		padding-bottom: var(--sp-02);
		margin-bottom: var(--sp-02);
		padding-left: var(--sp-02);
		border-bottom: 1px solid var(--bg-border);

		.add-theme {
			margin-left: auto;
		}
		button {
			color: var(--bg-text-02);
			padding: var(--sp-01);
			border-radius: 7px;
			&:hover {
				background-color: var(--bg-hover);
				color: var(--primary);
			}
		}
	}

	select {
		width: 100%;
		padding: var(--sp-01) var(--sp-02);
	}

	.theme-name {
		width: 100%;
		margin-top: var(--sp-01);
	}
</style>
