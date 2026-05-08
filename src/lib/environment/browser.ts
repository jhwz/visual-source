import type { Storage, StorageOutputs } from './index.js';

const MANIFEST_KEY = 'visual-source:manifest';

export const browser_storage: Storage = {
	async load_manifest() {
		if (typeof localStorage === 'undefined') return null;
		return localStorage.getItem(MANIFEST_KEY);
	},
	async write_outputs({ manifest }: StorageOutputs) {
		if (typeof localStorage === 'undefined') return;
		localStorage.setItem(MANIFEST_KEY, manifest);
	}
};

export function clear_browser_manifest() {
	if (typeof localStorage === 'undefined') return;
	localStorage.removeItem(MANIFEST_KEY);
}

export function download_text(filename: string, content: string, mime = 'text/plain') {
	const blob = new Blob([content], { type: mime });
	const url = URL.createObjectURL(blob);
	const a = document.createElement('a');
	a.href = url;
	a.download = filename;
	document.body.appendChild(a);
	a.click();
	a.remove();
	URL.revokeObjectURL(url);
}

export async function read_file_as_text(file: File): Promise<string> {
	return await file.text();
}
