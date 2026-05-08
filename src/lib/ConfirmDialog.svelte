<script lang="ts">
	import { Modal } from './Modal/index.js';
	import Button from './Button.svelte';

	type Variant = 'destructive' | 'default';

	interface Props {
		open: boolean;
		title: string;
		message: string;
		confirmLabel?: string;
		cancelLabel?: string;
		variant?: Variant;
		onconfirm?: () => void;
		oncancel?: () => void;
	}

	let {
		open = $bindable(),
		title,
		message,
		confirmLabel = 'Delete',
		cancelLabel = 'Cancel',
		variant = 'destructive',
		onconfirm,
		oncancel
	}: Props = $props();

	let modal: Modal | undefined = $state();
	// Element that had focus when the dialog opened — focus returns here on close.
	let returnFocusEl: HTMLElement | null = null;

	$effect(() => {
		if (open) {
			returnFocusEl = (document.activeElement as HTMLElement | null) ?? null;
			modal?.open();
		} else {
			modal?.close();
		}
	});

	// Called by Modal when the dialog closes (ESC, close button, or programmatic).
	function handleClose() {
		open = false;
		queueMicrotask(() => {
			returnFocusEl?.focus();
			returnFocusEl = null;
		});
	}

	function confirm() {
		onconfirm?.();
		open = false;
	}

	function cancel() {
		oncancel?.();
		open = false;
	}
</script>

<Modal bind:this={modal} {title} onclose={handleClose}>
	<confirm-body>
		<p>{message}</p>
	</confirm-body>
	<confirm-footer>
		<Button type="ghost" onclick={cancel}>{cancelLabel}</Button>
		<Button type={variant === 'destructive' ? 'destructive' : 'primary'} onclick={confirm}>
			{confirmLabel}
		</Button>
	</confirm-footer>
</Modal>

<style>
	confirm-body {
		display: block;
	}
	confirm-body p {
		margin: 0;
		color: var(--surface-text-01);
		line-height: 1.5;
	}
	confirm-footer {
		display: flex;
		justify-content: flex-end;
		gap: var(--sp-02);
		margin-top: var(--sp-04);
	}
</style>
