<script lang="ts">
	import ConfirmDialog from '$lib/ConfirmDialog.svelte';
	import IconButton from '$lib/IconButton.svelte';
	import Minus from '$lib/icons/Minus.svelte';
	import Plus from '$lib/icons/Plus.svelte';
	import { spec } from '$lib/spec.svelte.js';
	import { themeContext } from '$lib/theme-context.svelte.js';
	import { next_id } from '$lib/utils';

	let confirmOpen = $state(false);
	let activeTheme = $derived(
		themeContext.activeThemeId == null
			? null
			: (spec.themes.find((t) => t.id === themeContext.activeThemeId) ?? null)
	);

	function add_theme() {
		const id = next_id(spec.themes);
		spec.themes.push({
			id,
			name: `Theme ${spec.themes.length + 1}`,
			tokens: [],
			spacing: [],
			general: []
		});
		themeContext.activeThemeId = id;
	}

	function request_remove() {
		if (themeContext.activeThemeId == null) return;
		confirmOpen = true;
	}

	function remove_theme() {
		if (themeContext.activeThemeId == null) return;
		spec.themes = spec.themes.filter((t) => t.id !== themeContext.activeThemeId);
		themeContext.activeThemeId = null;
	}
</script>

<themes-section>
	<sidebar-section-header>
		<span>Theme</span>
		<header-actions>
			<IconButton icon={Plus} label="Add theme" size="sm" onclick={add_theme} />
			{#if activeTheme}
				<IconButton icon={Minus} label="Remove selected theme" size="sm" onclick={request_remove} />
			{/if}
		</header-actions>
	</sidebar-section-header>

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

	{#if activeTheme}
		{@const theme = activeTheme}
		<input
			type="text"
			class="theme-name"
			value={theme.name}
			oninput={(e) => {
				theme.name = e.currentTarget.value;
			}}
		/>
	{/if}
</themes-section>

<ConfirmDialog
	bind:open={confirmOpen}
	title="Delete theme?"
	message={activeTheme
		? `Delete theme "${activeTheme.name}"? This cannot be undone.`
		: 'Delete this theme?'}
	confirmLabel="Delete"
	variant="destructive"
	onconfirm={remove_theme}
/>

<style>
	themes-section {
		display: flex;
		flex-direction: column;
		gap: var(--sp-01);
		margin-top: var(--sp-02);
	}

	sidebar-section-header {
		display: flex;
		align-items: center;
		gap: var(--sp-02);
		padding: var(--sp-01) var(--sp-02);
		margin-bottom: var(--sp-01);

		color: var(--bg-text-02);
		font-size: 0.7rem;
		font-weight: 600;
		text-transform: uppercase;
		letter-spacing: 0.05em;
	}

	header-actions {
		display: flex;
		align-items: center;
		gap: var(--sp-0p5);
		margin-left: auto;
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
