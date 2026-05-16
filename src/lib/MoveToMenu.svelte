<script lang="ts">
	import Button from './Button.svelte';
	import ArrowRight from './icons/ArrowRight.svelte';
	import Popover from './Popover.svelte';

	type Group = { name: string };

	type Props = {
		groups: Group[];
		currentIndex: number;
		onmove: (targetIndex: number) => void;
	};

	let { groups, currentIndex, onmove }: Props = $props();

	let targets = $derived(
		groups
			.map((g, i) => ({ index: i, name: i === 0 ? 'Ungrouped' : g.name || 'Untitled Group' }))
			.filter((g) => g.index !== currentIndex)
	);
</script>

<Popover>
	{#snippet trigger({ open })}
		<Button onclick={open} type="secondary" size="sm" icon={ArrowRight}>Move To…</Button>
	{/snippet}
	{#snippet content({ close })}
		<menu-content>
			{#if targets.length === 0}
				<empty-hint>No other groups</empty-hint>
			{:else}
				{#each targets as t (t.index)}
					<button
						type="button"
						onclick={() => {
							onmove(t.index);
							close();
						}}
					>
						{t.name}
					</button>
				{/each}
			{/if}
		</menu-content>
	{/snippet}
</Popover>

<style>
	menu-content {
		display: flex;
		flex-direction: column;
		min-width: 180px;
		padding: var(--sp-01);
	}

	menu-content button {
		display: block;
		width: 100%;
		padding: var(--sp-02) var(--sp-03);
		background: transparent;
		border: none;
		border-radius: var(--radius-sm);
		color: var(--bg-text-01);
		font-size: 0.85rem;
		text-align: left;
		cursor: pointer;
		transition: background-color 0.12s;
	}

	menu-content button:hover {
		background-color: var(--bg-hover);
	}

	empty-hint {
		display: block;
		padding: var(--sp-02) var(--sp-03);
		color: var(--bg-text-02);
		font-size: 0.8rem;
	}
</style>
