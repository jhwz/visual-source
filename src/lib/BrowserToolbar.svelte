<script lang="ts">
	import { download_text, read_file_as_text } from '$lib/environment/browser.js';
	import { generate_css } from '$lib/generate/css.js';
	import { generate_json } from '$lib/generate/json.js';
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

	function download_json() {
		download_text('visual-source.json', generate_json(spec), 'application/json');
	}
</script>

<browser-toolbar>
	<header>Project</header>
	<button onclick={() => importInput?.click()}>Import manifest…</button>
	<input
		bind:this={importInput}
		type="file"
		accept="application/json,.json"
		onchange={on_import}
		hidden
	/>
	<button onclick={download_manifest}>Download manifest</button>
	<button onclick={download_css}>Download CSS</button>
	<button onclick={download_json}>Download JSON</button>
</browser-toolbar>

<style>
	browser-toolbar {
		display: flex;
		flex-direction: column;
		gap: var(--sp-01);
		margin-top: var(--sp-04);
		padding-top: var(--sp-03);
		border-top: 1px solid var(--bg-border);
	}

	header {
		color: var(--bg-text-02);
		font-size: small;
		font-weight: bold;
		padding: var(--sp-01) var(--sp-02);
	}

	button {
		text-align: left;
		font-size: 0.85rem;
		color: var(--bg-text-01);
		padding: var(--sp-02);
		border-radius: 7px;
		background: none;
		border: none;
		cursor: pointer;

		&:hover {
			background-color: var(--bg-hover);
			color: var(--primary);
		}
	}

	input[hidden] {
		display: none;
	}
</style>
