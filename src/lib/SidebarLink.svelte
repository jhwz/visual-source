<script lang="ts">
	import { page } from '$app/state';
	import type { Snippet } from 'svelte';

	type Props = {
		children: Snippet;
		href: string;
		routeId: string;
	};
	let { children, href, routeId }: Props = $props();

	let selected = $derived.by(() => page.route.id === routeId);
</script>

<a {href} class:selected aria-current={selected ? 'page' : undefined}>
	<accent aria-hidden="true"></accent>
	<label>{@render children()}</label>
</a>

<style>
	a {
		position: relative;
		display: flex;
		align-items: center;
		gap: var(--sp-02);

		color: var(--bg-text-02);
		background-color: transparent;
		padding: var(--sp-02) var(--sp-03);
		text-decoration: none;

		border: none;
		border-radius: var(--radius-md);
		cursor: pointer;
		font-size: 0.9rem;

		transition:
			background-color 0.12s,
			color 0.12s;
	}

	accent {
		display: block;
		width: 3px;
		height: 1.1rem;
		border-radius: 2px;
		background-color: transparent;
		flex-shrink: 0;
		transition: background-color 0.12s;
	}

	label {
		display: block;
	}

	a:hover {
		color: var(--bg-text-01);
		background-color: var(--bg-hover);
	}

	a.selected {
		background-color: var(--bg-hover);
		color: var(--bg-text-01);
		font-weight: 600;
	}

	a.selected accent {
		background-color: var(--primary);
	}
</style>
