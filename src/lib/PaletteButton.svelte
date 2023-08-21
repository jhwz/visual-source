<script lang="ts">
	import { createEventDispatcher } from 'svelte';

	const dispatch = createEventDispatcher<{ change: string }>();

	export let name: string;
	export let selected: boolean;
</script>

<input
	type="text"
	value={name}
	class:selected
	readonly
	on:click
	on:dblclick={(e) => {
		e.currentTarget.readOnly = false;
	}}
	on:blur={(e) => {
		e.currentTarget.readOnly = true;
		dispatch('change', e.currentTarget.value);
	}}
	on:keydown={(e) => {
		if (e.key === 'Enter') {
			e.preventDefault();
			e.currentTarget.blur();
		}
	}}
/>

<style>
	input {
		display: block;
		max-width: 8rem;
		width: 100%;

		border: none;
		border-radius: 5px;
		cursor: pointer;

		color: #aaa;
		background-color: inherit;

		font-size: 1rem;
		padding: var(--sp-02) var(--sp-04);
		padding-right: var(--sp-06);

		user-select: none;
	}
	input.selected {
		background-color: #444;
		color: #ccc;
	}
	input:not(:read-only) {
	}
	input:hover {
		color: #ccc;
	}
</style>
