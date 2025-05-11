<script lang="ts">
	import Popover from '$lib/Popover.svelte';
	import { spec } from '$lib/spec.svelte';
</script>

<Popover
	onclose={() => {
		selectedPalette = null;
	}}
>
	{#snippet trigger({ open })}
		<button
			class="link-token"
			class:linked={!!token.$ref}
			onclick={() => {
				if (token.$ref) {
					selectedPalette = parseInt(token.$ref.split('/')[2]);
				}
				open();
			}}
		>
			<Link size={14} />
			{#if !token.$ref}
				Link
			{:else}
				{@const parts = token.$ref.split('/')}
				{@const palette = parseInt(parts[2])}
				{@const color = parseInt(parts[4])}
				{spec.palettes[palette].name} ({color + 1})
			{/if}
		</button>
	{/snippet}
	{#snippet content({ close })}
		<popover-content>
			{#if selectedPalette != null}
				<button
					class="on-back"
					onclick={() => {
						selectedPalette = null;
					}}
				>
					<ArrowLeft /> Back
				</button>

				{#each spec.palettes[selectedPalette].colors as c, i}
					<button
						class="palette-color"
						onclick={() => {
							token.$ref = `#/palettes/${selectedPalette as number}/colors/${i}`;
							token.value = undefined;
							close();
						}}
					>
						{c} ({i + 1})
						<color-indicator style="--color: {c}"></color-indicator>
					</button>
				{/each}
			{:else}
				{#each spec.palettes as p, i}
					<button
						class="select-palette"
						onclick={() => {
							selectedPalette = i;
						}}
					>
						{p.name}
						<span><ArrowRight /></span>
					</button>
				{/each}
				{#if !!token.$ref}
					<button
						class="select-palette unlink"
						onclick={() => {
							const resolved = resolve_ref(spec, token.$ref!);
							if (resolved) token.value = resolved as string;
							else token.value = '#000000';
							token.$ref = undefined;
							close();
						}}
					>
						Unlink
						<span><Close /></span>
					</button>
				{/if}
			{/if}
		</popover-content>
	{/snippet}
</Popover>
