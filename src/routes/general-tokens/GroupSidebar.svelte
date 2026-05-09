<script lang="ts">
	import Button from '$lib/Button.svelte';
	import ConfirmDialog from '$lib/ConfirmDialog.svelte';
	import FormField from '$lib/FormField.svelte';
	import Copy from '$lib/icons/Copy.svelte';
	import Plus from '$lib/icons/Plus.svelte';
	import Trash from '$lib/icons/Trash.svelte';
	import type { BuiltGeneralTokenGroup } from './general_tokens';

	type Props = {
		group: BuiltGeneralTokenGroup;
		ondelete: () => void;
		onduplicate: () => void;
		ontokenadd: () => void;
	};
	let { group = $bindable(), ondelete, onduplicate, ontokenadd }: Props = $props();

	let confirmDeleteOpen = $state(false);
</script>

<side-panel-content>
	<FormField label="Group Name">
		<input type="text" bind:value={group.name} />
	</FormField>

	<FormField label="Description">
		<textarea bind:value={group.description} rows="3"></textarea>
	</FormField>

	<group-actions>
		<Button onclick={ontokenadd} type="secondary" size="sm" icon={Plus}>Add Token</Button>
		<Button onclick={onduplicate} type="secondary" size="sm" icon={Copy}>Duplicate</Button>
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
	</group-actions>
</side-panel-content>

<ConfirmDialog
	bind:open={confirmDeleteOpen}
	title="Delete group?"
	message={group.tokens.length
		? `Delete the '${group.name}' group and its ${group.tokens.length} token${group.tokens.length === 1 ? '' : 's'}? This can't be undone.`
		: `Delete the '${group.name}' group? This can't be undone.`}
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

	group-actions {
		display: flex;
		flex-wrap: wrap;
		gap: var(--sp-02);
		margin-top: auto;
	}
</style>
