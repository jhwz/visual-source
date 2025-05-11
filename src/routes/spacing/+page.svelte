<script lang="ts">
	import { spec } from '$lib/spec.svelte.js';

	spec;
</script>

<h3>Spacing</h3>
<help-text>
	<p>Manage the spacing tokens for your project</p>
</help-text>

{#if !spec.spacing.values?.length}
	<choose-preset-grid>
		<button>Tailwind</button>
	</choose-preset-grid>
{:else}
	<spacing-values>
		{#each spec.spacing.values as value, i}
			<div>
				<input type="text" bind:value={spec.spacing.values[i]} />
				<spacing-indicator></spacing-indicator>
			</div>
		{/each}
	</spacing-values>
{/if}
