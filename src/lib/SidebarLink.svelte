<script lang="ts">
	import { page } from '$app/stores';
	import type { Snippet } from 'svelte';
	import { fromStore } from 'svelte/store';

	type Props = {
		children: Snippet;
		href: string;
		routeId: string;
	};
	let { children, href, routeId }: Props = $props();

	let pagerune = fromStore(page);
	let selected = $derived.by(() => pagerune.current.route.id === routeId);
</script>

<a {href} class:selected>
	{@render children()}
</a>

<style>
	a {
		color: #aaa;
		background-color: inherit;
		padding: var(--sp-02) var(--sp-02);
		padding-right: var(--sp-06);
		text-decoration: none;

		border: none;
		border-radius: 5px;
		cursor: pointer;

		&.selected {
			background-color: #444;
			color: #ccc;
		}
		&:not(:is(.selected, .editable)):hover {
			color: #ccc;
		}
	}
</style>
