<script lang="ts">
	import type { Snippet } from 'svelte';
	type Props = {
		dialog: HTMLDialogElement;
		children?: Snippet;
	};

	let { dialog = $bindable(), children }: Props = $props();
</script>

<!-- svelte-ignore a11y_no_noninteractive_element_interactions -->
<dialog
	bind:this={dialog}
	onkeyup={(e) => {
		if (e.key === 'Escape') close();
	}}
>
	<div>
		{@render children?.()}
	</div>
</dialog>

<style>
	dialog {
		top: 40%;
		left: 50%;
		transform: translate(-50%, -50%);
		margin-top: var(--sp-08);
		padding: 0;

		background: var(--surface);
		color: var(--surface-text-01);
		box-shadow: rgba(99, 99, 99, 0.2) 0px 2px 8px 0px;
		border: none;
		border-radius: 5px;

		max-height: 90vh;
		max-width: 100%;
		min-width: min(32rem, 100%);

		overflow: unset;
	}
	div {
		display: flex;
		flex-direction: column;
		align-items: stretch;
	}
	dialog::backdrop {
		background: #00000040;
	}

	dialog[open] {
		animation: zoom 0.3s cubic-bezier(0.34, 1.56, 0.64, 1);
	}

	@media (max-width: 672px) {
		dialog {
			top: 0;
			left: 0;
			transform: none;
			width: 100%;
			height: 100%;
			max-height: 100%;
			border-radius: 0;
			margin: 0;
		}

		dialog[open] {
			animation: none;
		}
		div {
			height: 100%;
		}
	}

	@keyframes zoom {
		from {
			transform: scale(0.9) translate(-50%, -50%);
		}
		to {
			transform: scale(1) translate(-50%, -50%);
		}
	}
	dialog[open]::backdrop {
		animation: fade 0.2s ease-out;
	}
	@keyframes fade {
		from {
			opacity: 0;
		}
		to {
			opacity: 1;
		}
	}
</style>
