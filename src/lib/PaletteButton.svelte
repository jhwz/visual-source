<script lang="ts">
	import type { MouseEventHandler } from 'svelte/elements';

	type Props = {
		name: string;
		selected: boolean;
		onclick?: MouseEventHandler<HTMLInputElement>;
		onchange: (s: string) => void;
	};

	let { name, selected, onclick, onchange }: Props = $props();
</script>

<input
	type="text"
	value={name}
	class:selected
	readonly
	{onclick}
	ondblclick={(e) => {
		e.currentTarget.readOnly = false;
	}}
	onblur={(e) => {
		e.currentTarget.readOnly = true;
		onchange(e.currentTarget.value);
	}}
	onkeydown={(e) => {
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
	input:hover {
		color: #ccc;
	}
</style>
