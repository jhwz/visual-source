<script lang="ts">
	type Props = {
		name: string;
		selected: boolean;
		onclick?: () => void;
		onchange: (s: string) => void;
	};

	let { name, selected, onclick, onchange }: Props = $props();

	let editable = $state(false);
</script>

<button
	onclick={() => {
		if (!selected) onclick?.();
	}}
	ondblclick={() => {
		editable = true;
	}}
	onkeydown={(e) => {
		if (editable && e.key === 'Enter') {
			e.preventDefault;
			editable = false;
			name = e.currentTarget.innerText!;
			onchange(name);
		}
	}}
	class:selected
	contenteditable={selected && editable ? 'true' : 'false'}
>
	{name}
</button>

<style>
	button {
		display: block;
		max-width: 12rem;
		width: 100%;

		border: none;
		border-radius: 5px;
		cursor: pointer;

		color: #aaa;
		text-align: left;
		background-color: inherit;

		font-size: 1rem;
		padding: var(--sp-02) var(--sp-02);
		padding-right: var(--sp-06);

		user-select: none;
	}
	button.selected {
		background-color: #444;
		color: #ccc;
	}
	button:not(:is(.selected, .editable)):hover {
		color: #ccc;
	}
	button[contenteditable='true'] {
		background-color: inherit;
		border: 1px solid #444;
	}
</style>
