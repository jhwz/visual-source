<script lang="ts">
	import Button from '$lib/Button.svelte';
	import { exampleColorTokens } from '$lib/data/colortokens';
	import { openColorPalettes, tailwindPalettes } from '$lib/data/palettes';
	import { tailwindSpacing } from '$lib/data/spacing';
	import LogoOpenColor from '$lib/icons/LogoOpenColor.svelte';
	import LogoTailwind from '$lib/icons/LogoTailwind.svelte';
	import LogoVisualSource from '$lib/icons/LogoVisualSource.svelte';
	import Modal from '$lib/Modal/Modal.svelte';
	import { spec } from '$lib/spec.svelte';
	import { next_id } from '$lib/utils';
	import { onMount, type Component } from 'svelte';

	type Props = {};
	let {}: Props = $props();

	let modal: Modal | undefined = $state();

	onMount(() => {
		setTimeout(() => {
			if (!spec.color.palettes.length && !spec.color.tokens.length && !spec.spacing.scale.length) {
				modal?.open();
			}
		});
	});

	const steps = [
		{ id: 'start', title: 'Welcome to Visual Source' },
		{ id: 'palettes', title: 'Choose Palettes' },
		{ id: 'spacing', title: 'Choose Spacing Token Set' },
		{ id: 'colorTokens', title: 'Choose Color Token Set' }
	] as const;
	let step = $state(0);
	let currentstep = $derived(steps[step]);
	function next() {
		if (step == steps.length - 1) modal?.close();
		else step++;
	}

	const palettes = [
		{
			title: 'Tailwind',
			description: 'Palettes Tailwind provides by default',
			link: 'https://tailwindcss.com/docs/colors',
			data: tailwindPalettes,
			logo: LogoTailwind
		},
		{
			title: 'Open Color',
			description: 'Palettes from the Open Color open-source color scheme',
			link: 'https://yeun.github.io/open-color/',
			data: openColorPalettes,
			logo: LogoOpenColor
		}
	] as const;

	const spacing = [
		{
			title: 'Tailwind',
			logo: LogoTailwind,
			data: tailwindSpacing,
			description: `CSS tokens aligned with Tailwind's spacing scheme`
		}
	] as const;

	const colorTokenSets = [
		{
			title: 'Example',
			logo: LogoVisualSource,
			data: exampleColorTokens,
			description: `Example color tokens to get you started`
		}
	] as const;
</script>

{#snippet option(
	title: string,
	Logo: Component<{ size?: number }>,
	desc: string,
	onclick: () => void
)}
	<button
		onclick={(e) => {
			if (e.target instanceof HTMLAnchorElement) return;
			onclick();
		}}
	>
		<opt-head>
			<Logo size={24} />
			<h4>{title}</h4>
		</opt-head>
		<p>{desc}</p>
	</button>
{/snippet}

<Modal bind:this={modal} title={currentstep.title}>
	{#if currentstep.id === 'start'}
		<p>Let's get you set up with some defaults</p>

		<modal-footer>
			<Button onclick={next}>Next</Button>
		</modal-footer>
	{:else if currentstep.id === 'palettes'}
		<select-grid>
			<button class="none" onclick={next}>
				<h4>None</h4>
			</button>
			{#each palettes as p}
				{@render option(p.title, p.logo, p.description, () => {
					for (const palette of p.data) {
						spec.color.palettes.push({
							...palette,
							id: next_id(spec.color.palettes)
						});
					}
					next();
				})}
			{/each}
		</select-grid>
	{:else if currentstep.id === 'spacing'}
		<select-grid>
			<button class="none" onclick={next}>
				<h4>None</h4>
			</button>
			{#each spacing as p}
				{@render option(p.title, p.logo, p.description, () => {
					for (const t of p.data) {
						spec.spacing.scale.push({
							...t,
							id: next_id(spec.spacing.scale)
						});
					}
					next();
				})}
			{/each}
		</select-grid>
	{:else if currentstep.id === 'colorTokens'}
		<select-grid>
			<button class="none" onclick={next}>
				<h4>None</h4>
			</button>
			{#each colorTokenSets as p}
				{@render option(p.title, p.logo, p.description, () => {
					spec.color.tokens = p.data.tokens;
					spec.color.groups = p.data.groups;
					next();
				})}
			{/each}
		</select-grid>
	{/if}
</Modal>

<style>
	modal-footer {
		display: flex;
		margin-top: var(--sp-06);
		justify-content: flex-end;
	}

	select-grid {
		display: flex;
		flex-wrap: wrap;
		gap: var(--sp-04);

		min-width: 60vw;

		button {
			border: 1px solid var(--surface-border);
			padding: var(--sp-03) var(--sp-04);
			min-width: 8rem;
			border-radius: 5px;

			display: flex;
			flex-direction: column;
			align-items: stretch;
			justify-content: center;
			gap: var(--sp-01);

			opt-head {
				display: flex;
				justify-content: center;
				align-items: center;
				gap: var(--sp-03);
			}

			p {
				font-size: small;
				color: var(--bg-text-02);
				max-width: 16rem;
			}

			&.none {
				h4 {
					color: var(--bg-text-02);
				}
			}
			&:hover {
				background-color: var(--surface-hover);
			}
		}
	}
</style>
