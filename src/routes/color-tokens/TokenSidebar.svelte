<script lang="ts">
	import Button from '$lib/Button.svelte';
	import FormField from '$lib/FormField.svelte';
	import { token_css_name } from '$lib/generate/css';
	import { spec, type Token } from '$lib/spec.svelte';
	import TokenColor from './TokenColor.svelte';

	type Props = {
		token: Token;
		ondelete: () => void;
	};
	let { token = $bindable(), ondelete }: Props = $props();
</script>

<side-panel-content>
	<FormField label="Token Name">
		<input type="text" bind:value={token.name} />
	</FormField>

	<FormField label="Description">
		<textarea bind:value={token.description} rows="3"></textarea>
	</FormField>

	<FormField label="CSS Variable Name">
		<css-name>
			<span>--</span>
			<input
				type="text"
				spellcheck="false"
				value={token_css_name(token, spec.color.groups)}
				onchange={(e) => {
					const value = e.currentTarget.value;
					if (!value && token.css) token.css.name = undefined;
					else {
						token.css ||= {};
						token.css.name = value;
					}
				}}
			/>
		</css-name>
	</FormField>

	<section>
		<h3>Color</h3>
		<TokenColor bind:token />
	</section>

	<delete-token>
		<Button onclick={ondelete} type="error">Delete</Button>
	</delete-token>
</side-panel-content>

<style>
	side-panel-content {
		display: flex;
		flex-direction: column;
		gap: var(--sp-04);
		padding: var(--sp-04) var(--sp-03);
	}

	section {
		margin-top: var(--sp-04);
	}

	delete-token {
		display: block;
		margin-top: auto;
	}
</style>
