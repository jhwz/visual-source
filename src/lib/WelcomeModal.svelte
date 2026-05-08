<script lang="ts">
	import Button from '$lib/Button.svelte';
	import { exampleColorTokens } from '$lib/data/colortokens';
	import { openColorPalettes } from '$lib/data/palettes';
	import { tailwindSpacing } from '$lib/data/spacing';
	import Close from '$lib/icons/Close.svelte';
	import LogoOpenColor from '$lib/icons/LogoOpenColor.svelte';
	import LogoTailwind from '$lib/icons/LogoTailwind.svelte';
	import LogoVisualSource from '$lib/icons/LogoVisualSource.svelte';
	import Modal from '$lib/Modal/Modal.svelte';
	import { spec } from '$lib/spec.svelte';
	import { next_id } from '$lib/utils';
	import WelcomeTile from '$lib/WelcomeTile.svelte';
	import { onMount } from 'svelte';

	type Props = {
		oncomplete: () => void;
	};
	let { oncomplete }: Props = $props();

	let modal: Modal | undefined = $state();

	onMount(() => {
		setTimeout(() => {
			if (!spec.color.palettes.length && !spec.color.tokens.length && !spec.spacing.scale.length) {
				modal?.open();
			}
		});
	});

	const stepIds = ['palettes', 'spacing', 'colorTokens'] as const;
	type StepId = (typeof stepIds)[number];

	const stepTitle: Record<StepId, string> = {
		palettes: 'Choose palettes',
		spacing: 'Choose a spacing scale',
		colorTokens: 'Choose color tokens'
	};

	let step = $state(0);
	let currentStep = $derived(stepIds[step]);
	let title = $derived(`${stepTitle[currentStep]} — Step ${step + 1} of ${stepIds.length}`);
	let isLast = $derived(step === stepIds.length - 1);

	function next() {
		if (isLast) {
			finish();
		} else {
			step++;
		}
	}

	function finish() {
		oncomplete();
		modal?.close();
	}

	const palettes = [
		{
			title: 'Open Color',
			description: 'Palettes from the Open Color open-source color scheme.',
			data: openColorPalettes,
			logo: LogoOpenColor
		}
	] as const;

	const spacing = [
		{
			title: 'Tailwind',
			logo: LogoTailwind,
			data: tailwindSpacing,
			description: `CSS tokens aligned with Tailwind's spacing scheme.`
		}
	] as const;

	const colorTokenSets = [
		{
			title: 'Example',
			logo: LogoVisualSource,
			data: exampleColorTokens,
			description: `Example color tokens to get you started.`
		}
	] as const;

	function applyPalettes(data: typeof openColorPalettes) {
		for (const palette of data) {
			spec.color.palettes.push({
				...palette,
				id: next_id(spec.color.palettes)
			});
		}
		next();
	}

	function applySpacing(data: typeof tailwindSpacing) {
		for (const t of data) {
			spec.spacing.scale.push({
				...t,
				id: next_id(spec.spacing.scale)
			});
		}
		next();
	}

	function applyColorTokens(data: typeof exampleColorTokens) {
		spec.color.tokens = data.tokens;
		spec.color.groups = data.groups;
		next();
	}
</script>

<Modal bind:this={modal} {title}>
	<welcome-body>
		<intro>Choose starting points or skip and start blank.</intro>

		<welcome-grid>
			{#if currentStep === 'palettes'}
				<WelcomeTile
					icon={Close}
					title="None"
					description="Start with an empty palette set."
					muted
					onclick={next}
				/>
				{#each palettes as p}
					<WelcomeTile
						icon={p.logo}
						title={p.title}
						description={p.description}
						onclick={() => applyPalettes(p.data)}
					/>
				{/each}
			{:else if currentStep === 'spacing'}
				<WelcomeTile
					icon={Close}
					title="None"
					description="Start with no spacing tokens."
					muted
					onclick={next}
				/>
				{#each spacing as p}
					<WelcomeTile
						icon={p.logo}
						title={p.title}
						description={p.description}
						onclick={() => applySpacing(p.data)}
					/>
				{/each}
			{:else if currentStep === 'colorTokens'}
				<WelcomeTile
					icon={Close}
					title="None"
					description="Start with no color tokens."
					muted
					onclick={next}
				/>
				{#each colorTokenSets as p}
					<WelcomeTile
						icon={p.logo}
						title={p.title}
						description={p.description}
						onclick={() => applyColorTokens(p.data)}
					/>
				{/each}
			{/if}
		</welcome-grid>

		<welcome-footer>
			<Button type="ghost" onclick={finish}>Skip all</Button>
		</welcome-footer>
	</welcome-body>
</Modal>

<style>
	welcome-body {
		display: flex;
		flex-direction: column;
		gap: var(--sp-04);
		min-width: 60vw;
	}

	intro {
		display: block;
		color: var(--bg-text-02);
		font-size: 0.9rem;
	}

	welcome-grid {
		display: flex;
		flex-wrap: wrap;
		gap: var(--sp-04);
	}

	welcome-footer {
		display: flex;
		justify-content: flex-start;
		margin-top: var(--sp-02);
	}
</style>
