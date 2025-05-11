<script lang="ts">
	import { contrast_text_color, hex_to_rgb, rgb_to_hex } from '$lib/colors.js';
	import ArrowLeft from '$lib/icons/ArrowLeft.svelte';
	import ArrowRight from '$lib/icons/ArrowRight.svelte';
	import Close from '$lib/icons/Close.svelte';
	import Link from '$lib/icons/Link.svelte';
	import Popover from '$lib/Popover.svelte';
	import { resolve_ref } from '$lib/reftype.js';
	import { spec, token_value, type Token } from '$lib/spec.svelte.js';

	type Props = {
		token: Token;
		onchange: (token: Token) => void;
		ondelete: () => void;
		selected: boolean;
		onselect: () => void;
	};
	let { token, onchange, ondelete, selected, onselect }: Props = $props();

	let value = $derived(token_value(token));
	let rgb = $derived(hex_to_rgb(value));

	let selectedPalette = $state<null | number>(null);
</script>

<token-item
	style="--color: {token.value}; --text: {rgb_to_hex(contrast_text_color(rgb))}"
	class={{ selected }}
	role="button"
	tabindex="-1"
	onkeyup={() => {}}
	onclick={(e: MouseEvent) => {
		if (e.target === e.currentTarget) {
			onselect();
		}
	}}
>
	<token-data>
		<token-name
			contenteditable="plaintext-only"
			spellcheck="false"
			tabindex="0"
			role="textbox"
			onblur={(e: Event & { currentTarget: HTMLElement }) => {
				token.name = e.currentTarget.innerText;
				onchange(token);
			}}
		>
			{token.name}
		</token-name>
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
	</token-data>

	<input
		type="color"
		{value}
		disabled={!!token.$ref}
		onchange={(e) => {
			token.value = e.currentTarget.value;
			onchange(token);
		}}
	/>

	<button class="delete-token" onclick={ondelete}>
		<Close />
	</button>
</token-item>

<style>
	token-item {
		color: var(--text);
		padding: var(--sp-01) var(--sp-03);
		border-radius: 5px;
		display: grid;
		align-items: center;
		grid-template-columns: 1fr auto auto;
		border: 1px solid #ccc;
		user-select: none;

		&.selected {
			border-color: var(--primary-background);
		}
	}
	token-data {
		display: grid;
		min-width: 12rem;
		padding: var(--sp-01) 0;
	}

	token-name {
		min-width: 12rem;
		background-color: inherit;
		color: #aaa;
		border: none;
		white-space: nowrap;
		padding: var(--sp-01) var(--sp-02);
		margin-right: var(--sp-04);
		border-radius: 5px;
		transition: background-color 0.15s;
		&:focus {
			outline: none;
		}
		&:hover,
		&:focus {
			background-color: #2e2e2e;
		}
	}
	.link-token {
		color: #999;
		font-size: x-small;
		display: flex;
		align-items: center;
		gap: var(--sp-01);

		&:hover {
			color: #ccc;
		}
		&.linked {
			color: #0a0;
		}
	}

	popover-content {
		display: flex;
		flex-direction: column;
		min-width: 16rem;
	}

	.select-palette {
		display: flex;
		justify-content: space-between;
		background-color: #333;
		color: #ccc;
		padding: var(--sp-01) var(--sp-02);
		border: none;
		transition: background-color 0.15s;
		&:hover {
			background-color: #444;
		}
		span {
			display: none;
		}
		&:hover span {
			display: block;
		}
		&.unlink {
			color: #e00;
		}
	}

	.palette-color {
		display: flex;
		justify-content: space-between;
		background-color: #333;
		color: #ccc;
		padding: var(--sp-01) var(--sp-02);
		border: none;
		transition: background-color 0.15s;
		&:hover {
			background-color: #444;
		}
		color-indicator {
			width: 20px;
			height: 20px;
			background-color: var(--color);
		}
	}
	.on-back {
		display: flex;
		gap: var(--sp-03);
		background-color: #333;
		color: #aaa;
		padding: var(--sp-01) var(--sp-02);
		border: none;
		transition: background-color 0.15s;
		&:hover {
			background-color: #444;
			color: #ccc;
		}
	}

	input[type='color'] {
		height: 3rem;
		width: 5rem;
		:not(:disabled) {
			cursor: pointer;
		}
	}
	.delete-token {
		cursor: pointer;
		color: #aaa;

		&:hover {
			color: #ccc;
		}
	}
</style>
