<script lang="ts">
	type Props = {
		color: string;
		onchange: (s: string) => void;
	};

	let { color, onchange }: Props = $props();

	// Local draft so the user can type freely without the prop snapping back mid-edit.
	let draft = $state('');
	let focused = $state(false);

	$effect(() => {
		if (!focused) draft = color;
	});

	function normalize(input: string): string | null {
		let v = input.trim().replace(/^#/, '');
		if (/^[0-9a-fA-F]{3}$/.test(v)) {
			v = v
				.split('')
				.map((c) => c + c)
				.join('');
		}
		if (!/^[0-9a-fA-F]{6}$/.test(v)) return null;
		return `#${v.toLowerCase()}`;
	}

	function commit(e: Event) {
		const input = e.currentTarget as HTMLInputElement;
		const next = normalize(input.value);
		if (next) {
			onchange(next);
			draft = next;
		} else {
			draft = color;
		}
	}

	function onkeydown(e: KeyboardEvent) {
		if (e.key === 'Enter') {
			(e.currentTarget as HTMLInputElement).blur();
		} else if (e.key === 'Escape') {
			draft = color;
			(e.currentTarget as HTMLInputElement).blur();
		}
	}
</script>

<input
	type="text"
	spellcheck="false"
	autocomplete="off"
	value={draft}
	onfocus={() => (focused = true)}
	onblur={(e) => {
		focused = false;
		commit(e);
	}}
	oninput={(e) => (draft = (e.currentTarget as HTMLInputElement).value)}
	{onkeydown}
	aria-label="Hex color"
/>

<style>
	input {
		flex: 1;
		width: 100%;
		border: 1px solid var(--surface-border);
		border-radius: var(--radius-sm);
		padding: var(--sp-01) var(--sp-02);
		font-family: var(--font-mono);
		font-size: 0.85rem;
		background-color: var(--bg-01, #fff);
		color: var(--surface-text-01);
	}
	input:focus {
		outline: 2px solid var(--primary);
		outline-offset: 1px;
	}
</style>
