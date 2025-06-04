<script lang="ts">
	import Button from '$lib/Button.svelte';
	import { openColorPalettes, tailwindPalettes } from '$lib/data/palettes';
	import { tailwindSpacing } from '$lib/data/spacing';
	import Modal from '$lib/Modal/Modal.svelte';
	import { spec } from '$lib/spec.svelte';

	type Props = {};
	let {}: Props = $props();

	let modal: Modal | undefined = $state();

	$effect(() => {
		modal?.open();
	});

	const steps = [
		{ id: 'start', title: 'Welcome to Visual Source' },
		{ id: 'palettes', title: 'Choose Palettes' },
		// { id: 'tokens', title: 'Choose Color Token Set' },
		{ id: 'spacing', title: 'Choose Spacing Token Set' }
	] as const;
	let step = $state(0);
	let currentstep = $derived(steps[step]);
	function next() {
		if (step == steps.length - 1) modal?.close();
		else step++;
	}

	const palettes = [
		{ title: 'Tailwind', link: 'https://tailwindcss.com/docs/colors', data: tailwindPalettes },
		{ title: 'Open Color', link: 'https://yeun.github.io/open-color/', data: openColorPalettes }
	] as const;

	const spacing = [{ title: 'Tailwind', data: tailwindSpacing }] as const;
</script>

<Modal bind:this={modal} title={currentstep.title}>
	{#if currentstep.id === 'start'}
		<p>Let's get you set up with some defaults</p>

		<modal-footer>
			<Button onclick={next}>Next</Button>
		</modal-footer>
	{:else if currentstep.id === 'palettes'}
		<select-grid>
			{#each palettes as p}
				<button
					onclick={(e) => {
						if (e.target instanceof HTMLAnchorElement) return;
						spec.palettes = p.data;
						next();
					}}
				>
					<h4>{p.title}</h4>
				</button>
			{/each}
		</select-grid>
	{:else if currentstep.id === 'spacing'}
		<select-grid>
			{#each spacing as p}
				<button
					onclick={(e) => {
						if (e.target instanceof HTMLAnchorElement) return;
						spec.spacing.scale = p.data;
						next();
					}}
				>
					<h4>{p.title}</h4>
				</button>
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
</style>
