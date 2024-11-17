<script lang="ts">
	import { reorderable } from '$lib';
	import Button from '$lib/Button.svelte';
	import Plus from '$lib/icons/Plus.svelte';
	import { spec } from '$lib/spec.svelte.js';
	import TokenItem from './TokenItem.svelte';

	const reorder = reorderable(({ from, to }) => {
		console.log('reorder', from, to);
		spec.tokens.splice(to, 0, spec.tokens.splice(from, 1)[0]);
	});
</script>

<main>
	<tokens-grid>
		{#each spec.tokens as token, i}
			<TokenItem
				{token}
				onchange={() => {
					spec.tokens[i] = token;
				}}
				ondelete={() => {
					spec.tokens = spec.tokens.filter((_, j) => j !== i);
				}}
			/>
		{/each}

		<span>
			<Button
				onclick={() => {
					spec.tokens.push({ name: 'New Token', value: '#ffffff' });
				}}
				icon={Plus}
			>
				Add Token
			</Button>
		</span>
	</tokens-grid>
</main>

<style>
	main {
		padding: var(--sp-08);
	}

	tokens-grid {
		display: flex;
		flex-direction: column;
		align-items: flex-start;
		column-gap: var(--sp-04);
		row-gap: var(--sp-04);
	}
</style>
