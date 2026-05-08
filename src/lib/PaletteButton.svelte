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
		<accent aria-hidden="true"></accent>
		<name-label>{name}</name-label>

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
		align-items: center;

		border: none;
		border-radius: var(--radius-md);
		cursor: pointer;

		color: var(--bg-text-02);
		text-align: left;
		background-color: transparent;

		font-size: 0.9rem;
		padding: var(--sp-02) var(--sp-03);
		gap: var(--sp-02);
	}

	input {
		background-color: var(--field);
		color: var(--field-text);
	}

	button {
		user-select: none;
		transition:
			background-color 0.12s,
			color 0.12s;

		accent {
			display: block;
			width: 3px;
			height: 1.1rem;
			border-radius: 2px;
			background-color: transparent;
			flex-shrink: 0;
			transition: background-color 0.12s;
		}

		name-label {
			flex: 1;
			min-width: 0;
			overflow: hidden;
			text-overflow: ellipsis;
			white-space: nowrap;
		}

		&:hover {
			color: var(--bg-text-01);
			background-color: var(--bg-hover);
		}

		&.selected {
			background-color: var(--bg-hover);
			color: var(--bg-text-01);
			font-weight: 600;

			accent {
				background-color: var(--primary);
			}

			&:hover {
				cursor: text;
			}
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
