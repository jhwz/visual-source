<script lang="ts">
	import Button from '$lib/Button.svelte';
	import { download_text, read_file_as_text } from '$lib/environment/browser.js';
	import { generate_css } from '$lib/generate/css.js';
	import { generate_dtcg } from '$lib/generate/dtcg.js';
	import { spec, write_spec_outputs } from '$lib/spec.svelte.js';

	let importInput: HTMLInputElement | undefined = $state();

	async function on_import(e: Event) {
		const input = e.currentTarget as HTMLInputElement;
		const file = input.files?.[0];
		if (!file) return;
		const text = await read_file_as_text(file);
		try {
			const parsed = JSON.parse(text);
			if (typeof parsed !== 'object' || parsed === null) throw new Error('not an object');
			Object.assign(spec, parsed);
			await write_spec_outputs();
		} catch (err) {
			alert('Could not import manifest: ' + (err instanceof Error ? err.message : String(err)));
		} finally {
			input.value = '';
		}
	}

	function download_manifest() {
		download_text('manifest.json', JSON.stringify(spec, null, 2), 'application/json');
	}

	function download_css() {
		download_text('visual-source.css', generate_css(spec), 'text/css');
	}

	function download_dtcg() {
		download_text('tokens.dtcg.json', generate_dtcg(spec), 'application/json');
	}
</script>

<project-actions>
	<Button type="ghost" size="sm" onclick={() => importInput?.click()}>Import manifest…</Button>
	<input
		bind:this={importInput}
		type="file"
		accept="application/json,.json"
		onchange={on_import}
		hidden
	/>
	<Button type="ghost" size="sm" onclick={download_manifest}>Download manifest</Button>
	<Button type="ghost" size="sm" onclick={download_css}>Download CSS</Button>
	<Button type="ghost" size="sm" onclick={download_dtcg}>Download DTCG</Button>
</project-actions>

<style>
	project-actions {
		display: flex;
		flex-direction: column;
		align-items: stretch;
		gap: var(--sp-0p5);
		margin-top: auto;
		padding-top: var(--sp-03);
		border-top: 1px solid var(--bg-border);
	}

	project-actions :global(button) {
		justify-content: flex-start;
	}

	input[hidden] {
		display: none;
	}
</style>
