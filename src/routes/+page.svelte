<script lang="ts">
	import { spec } from '$lib/spec.svelte.js';
	import { build_groups } from './color-tokens/color_tokens';
	import TokensPage from './TokensPage.svelte';
</script>

<TokensPage
	bind:groups={
		() => build_groups(spec),
		(groups) => {
			spec.color.tokens = groups.flatMap((g) => g.tokens);
			spec.color.groups = groups.slice(1).map((g) => ({ ...g, tokens: g.tokens.map((t) => t.id) }));
		}
	}
/>
