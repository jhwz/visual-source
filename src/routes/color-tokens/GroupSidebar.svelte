<script lang="ts">
	import Button from '$lib/Button.svelte';
	import ConfirmDialog from '$lib/ConfirmDialog.svelte';
	import FormField from '$lib/FormField.svelte';
	import Plus from '$lib/icons/Plus.svelte';
	import Trash from '$lib/icons/Trash.svelte';
	import type { BuiltTokenGroup } from './color_tokens';

	type Props = {
		group: BuiltTokenGroup;
		ondelete: () => void;
		ontokenadd: () => void;
	};
	let { group = $bindable(), ondelete, ontokenadd }: Props = $props();

	let confirmDeleteOpen = $state(false);
</script>

<side-panel-content>
	<FormField label="Group Name">
		<input type="text" bind:value={group.name} />
	</FormField>

	<FormField label="Description">
		<textarea bind:value={group.description} rows="3"></textarea>
	</FormField>

	<section>
		<h3>CSS</h3>
		<FormField label="Prefix">
			<input
				type="text"
				spellcheck="false"
				value={group.css?.prefix}
				onchange={(e) => {
					group.css ||= {};
					group.css.prefix = e.currentTarget.value || undefined;
				}}
			/>
		</FormField>
	</section>

	<Button onclick={ontokenadd} icon={Plus} type="secondary">Add Token</Button>

	{#if !group.tokens.length}
		<delete-token>
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
		</delete-token>
	{/if}
</side-panel-content>

<ConfirmDialog
	bind:open={confirmDeleteOpen}
	title="Delete group?"
	message="Delete the '{group.name}' group? This can't be undone."
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

	section {
		margin-top: var(--sp-04);
	}

	section h3 {
		margin: 0 0 var(--sp-02) 0;
	}

	delete-token {
		display: flex;
		margin-top: auto;
	}
</style>
