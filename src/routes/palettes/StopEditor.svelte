<script lang="ts">
	import Button from '$lib/Button.svelte';
	import ConfirmDialog from '$lib/ConfirmDialog.svelte';
	import HsvInputs from '$lib/HSVInputs.svelte';
	import Trash from '$lib/icons/Trash.svelte';
	import RgbInputs from '$lib/RGBInputs.svelte';
	import HexInput from './HexInput.svelte';

	type Props = {
		color: string;
		index: number;
		total: number;
		canDelete: boolean;
		onchange: (color: string) => void;
		ondelete: () => void;
	};

	let { color, index, total, canDelete, onchange, ondelete }: Props = $props();

	let confirmOpen = $state(false);
</script>

<editor-root>
	<editor-meta>Stop {index + 1} of {total}</editor-meta>

	<editor-fields>
		<field-row>
			<field-label>Hex</field-label>
			<HexInput {color} {onchange} />
		</field-row>
		<field-row>
			<field-label>RGB</field-label>
			<RgbInputs {color} {onchange} />
		</field-row>
		<field-row>
			<field-label>HSV</field-label>
			<HsvInputs {color} />
		</field-row>
	</editor-fields>

	<editor-actions>
		<Button
			icon={Trash}
			type="destructive"
			disabled={!canDelete}
			onclick={() => (confirmOpen = true)}
		>
			Delete Color
		</Button>
	</editor-actions>
</editor-root>

<ConfirmDialog
	bind:open={confirmOpen}
	title="Delete this color stop?"
	message="This stop will be removed from the palette. You can add it back later."
	confirmLabel="Delete"
	variant="destructive"
	onconfirm={ondelete}
/>

<style>
	editor-root {
		display: flex;
		flex-direction: column;
		gap: var(--sp-04);
		padding: var(--sp-04) var(--sp-05);
	}

	editor-meta {
		display: block;
		color: var(--surface-text-02);
		font-size: 0.75rem;
		text-transform: uppercase;
		letter-spacing: 0.04em;
	}

	editor-fields {
		display: flex;
		flex-direction: column;
		gap: var(--sp-02);
		padding: var(--sp-04) 0;
		border-top: 1px solid var(--surface-border);
		border-bottom: 1px solid var(--surface-border);
	}

	field-row {
		display: grid;
		grid-template-columns: 3rem 1fr;
		align-items: center;
		gap: var(--sp-02);
	}

	field-label {
		display: block;
		color: var(--surface-text-02);
		font-size: 0.75rem;
		text-transform: uppercase;
		letter-spacing: 0.04em;
	}

	editor-actions {
		display: flex;
	}
</style>
