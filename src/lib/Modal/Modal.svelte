<script lang="ts">
	import { flushSync, type Snippet } from 'svelte';
	import Base from './Base.svelte';
	import ModalCloseButton from './ModalCloseButton.svelte';

	let dialog = $state() as HTMLDialogElement;

	type Props = {
		overflow?: boolean;
		omitpadding?: boolean;
		onclose?: () => void;
		title?: string;
		children: Snippet;
	};
	let { overflow, omitpadding, onclose, title, children }: Props = $props();

	// renderChildren is an optimisation to avoid rendering the modal content when it's not open.
	// When the modal is opened, we first set renderChildren to true which causes anything in the children()
	// snippet to render (flushSync() makes sure those changes are finished). After rendering the children,
	// we can then open the dialog.
	let renderChildren = $state(false);

	export function open() {
		renderChildren = true;
		flushSync();

		dialog.showModal();
	}
	export function close() {
		dialog.close();
		onclose?.();

		renderChildren = false;
	}
</script>

<Base bind:dialog>
	<modal-header>
		<h3>{title}</h3>
		<ModalCloseButton onclick={close} />
	</modal-header>
	<modal-body class:overflow class:padding={!omitpadding}>
		{#if renderChildren}
			{@render children()}
		{/if}
	</modal-body>
</Base>

<style>
	modal-header {
		padding: var(--sp-02) 0;
		margin: 0 var(--sp-03);
	}

	modal-header {
		display: flex;
		align-items: center;
		border-bottom: 1px solid var(--bg-border);
	}

	modal-body {
		display: block;
	}
	modal-body.padding {
		padding: var(--sp-03);
		padding-top: var(--sp-04);
	}
	modal-body.overflow {
		overflow: auto;
		max-height: calc(90vh - (4rem + var(--sp-04)));
	}

	@media (max-width: 672px) {
		modal-body {
			height: 100%;
		}
	}
</style>
