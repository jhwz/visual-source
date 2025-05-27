<script lang="ts">
	import type { Snippet } from 'svelte';
	type Props = {
		label: string | Snippet;
		children?: Snippet;
		error?: string;
		description?: string | Snippet;
		style?: string;
	};

	let { label, children, description, error, style }: Props = $props();
</script>

<form-field {style}>
	{@render children?.()}

	<field-label>
		{#if typeof label === 'string'}{label}{:else}{@render label()}{/if}
	</field-label>

	{#if error}
		<error-text>{error}</error-text>
	{:else if description}
		<field-help>
			{#if typeof description === 'string'}{description}{:else}{@render description()}{/if}
		</field-help>
	{/if}
</form-field>

<style>
	field-label {
		font-size: small;
		color: var(--bg-text-02);
		height: 1.25rem;
	}

	form-field {
		display: grid;
		grid-template-columns: 1fr;
		align-items: center;
		height: min-content;

		field-label {
			grid-row: 1;
		}
	}

	form-field:has(:global(> input[type='checkbox'])) {
		display: grid;
		margin-top: 1.25rem;
		column-gap: var(--sp-02);
		grid-template-columns: auto 1fr;

		field-label {
			grid-column: 2;
		}

		field-help,
		error-text {
			grid-column: 1 / -1;
		}
	}
	field-help {
		display: block;
		color: rgb(var(--bg-text-02));
		font-size: smaller;
		max-width: 36rem;
		:global {
			ul {
				padding-left: var(--sp-04);
			}
		}
	}
</style>
