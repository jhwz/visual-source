<script lang="ts">
	import type { Component } from 'svelte';

	interface Props {
		icon: Component<{ size?: number }>;
		title: string;
		description: string;
		muted?: boolean;
		onclick: () => void;
	}

	let { icon: Icon, title, description, muted = false, onclick }: Props = $props();
</script>

<button type="button" {onclick} class:muted>
	<tile-head>
		<tile-icon class:muted>
			<Icon size={24} />
		</tile-icon>
		<h4>{title}</h4>
	</tile-head>
	<p>{description}</p>
</button>

<style>
	button {
		display: flex;
		flex-direction: column;
		align-items: stretch;
		justify-content: flex-start;
		gap: var(--sp-02);

		min-width: 12rem;
		max-width: 16rem;
		padding: var(--sp-04);
		border: 1px solid var(--surface-border);
		border-radius: var(--radius-md);
		background-color: transparent;
		color: var(--bg-text-01);
		cursor: pointer;
		text-align: left;
		transition:
			background-color 0.12s,
			border-color 0.12s;
	}
	button:hover {
		background-color: var(--surface-hover);
		border-color: var(--primary);
	}
	button:focus-visible {
		outline: 2px solid var(--primary);
		outline-offset: 1px;
	}

	tile-head {
		display: flex;
		align-items: center;
		gap: var(--sp-03);
	}

	tile-icon {
		display: inline-flex;
		align-items: center;
		justify-content: center;
		color: var(--bg-text-01);
	}
	tile-icon.muted {
		opacity: 0.5;
	}

	h4 {
		margin: 0;
		font-size: 0.95rem;
		font-weight: 600;
		color: var(--bg-text-01);
	}
	button.muted h4 {
		color: var(--bg-text-02);
	}

	p {
		margin: 0;
		font-size: 0.8rem;
		color: var(--bg-text-02);
		line-height: 1.4;
	}
</style>
