<script lang="ts">
	type Props = {
		name: string;
		selected: boolean;
		onclick: () => void;
		onchange: (s: string) => void;
	};

	let { name, selected, onclick, onchange }: Props = $props();

	let editable = $state(false);
</script>

{#if editable}
	<!-- svelte-ignore a11y_autofocus -->
	<input
		type="text"
		value={name}
		autofocus
		onchange={(e) => {
			name = e.currentTarget.value.trim();
			onchange(name);
			editable = false;
		}}
		onblur={() => {
			editable = false;
		}}
	/>
{:else}
	<button
		onclick={() => {
			if (!selected) {
				onclick();
			} else {
				editable = true;
			}
		}}
		class:selected
		contenteditable={selected && editable ? 'true' : 'false'}
	>
		{name}
	</button>
{/if}

<style>
	button,
	input {
		display: block;
		width: 100%;

		border: none;
		border-radius: 5px;
		cursor: pointer;

		color: #aaa;
		text-align: left;
		background-color: inherit;

		font-size: 0.9rem;
		padding: var(--sp-02) 0;
		padding-left: var(--sp-06);
		padding-right: var(--sp-06);
	}

	input {
		background-color: #333;
	}

	button {
		user-select: none;

		&.selected {
			background-color: #444;
			color: #ccc;
		}
		&:not(:is(.selected, .editable)):hover {
			color: #ccc;
		}
		&[contenteditable='true'] {
			background-color: inherit;
			border: 1px solid #444;
		}
	}
</style>
