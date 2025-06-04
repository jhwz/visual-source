<script lang="ts">
	type Props = {
		name: string;
		selected: boolean;
		onclick: () => void;
		onchange: (s: string) => void;
		colors: string[];
	};

	let { name, selected, onclick, onchange, colors }: Props = $props();

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
	>
		{name}

		<colors-preview>
			{#each colors as c}
				<span style="--color: {c}"></span>
			{/each}
		</colors-preview>
	</button>
{/if}

<style>
	button,
	input {
		display: flex;
		width: 100%;
		justify-content: space-between;

		border: none;
		border-radius: 5px;
		cursor: pointer;

		color: var(--bg-text-02);
		text-align: left;
		background-color: inherit;

		font-size: 0.9rem;
		padding: var(--sp-02) 0;
		padding-left: var(--sp-06);
		padding-right: var(--sp-06);
	}

	input {
		background-color: var(--field);
		color: var(--field-text);
	}

	button {
		user-select: none;

		&.selected {
			background-color: var(--bg-hover);
			color: var(--bg-text-01);
			&:hover {
				cursor: text;
			}
		}
		&:not(:is(.selected, .editable)):hover {
			color: var(--bg-text-01);
		}

		colors-preview {
			display: flex;
			width: 3rem;
			height: 100%;
			max-height: 1rem;
			flex: 0 0 3rem;

			span {
				flex: 1;
				background-color: var(--color);
			}
		}
	}
</style>
