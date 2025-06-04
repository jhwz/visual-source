<script lang="ts">
	type Props = {
		size?: number;
		onclick?: () => unknown;
	};

	let { size = 20, onclick }: Props = $props();
</script>

<button {onclick} type="button" aria-label="Close modal">
	<svg width={size} height={size} focusable="false" aria-hidden="true" viewBox="0 0 24 24">
		<path
			d="M19 6.41 17.59 5 12 10.59 6.41 5 5 6.41 10.59 12 5 17.59 6.41 19 12 13.41 17.59 19 19 17.59 13.41 12z"
		/>
	</svg>
</button>

<style>
	button {
		background-color: var(--surface);
		padding: var(--sp-02);
		border-radius: 8px;
		margin-left: auto;
	}
	button:hover {
		background-color: var(--surface-hover);
	}
	button:focus {
		outline: 1px solid var(--primary);
		outline-offset: 0;
	}

	button > svg {
		fill: var(--bg-text-02);
	}
	button:hover > svg {
		fill: var(--bg-text-01);
	}
</style>
