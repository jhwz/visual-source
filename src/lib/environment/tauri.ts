import { invoke } from '@tauri-apps/api/core';
import type { Storage, StorageOutputs } from './index.js';

export const tauri_storage: Storage = {
	async load_manifest() {
		return await invoke<string>('get');
	},
	async write_outputs({ manifest, css, json }: StorageOutputs) {
		await invoke('write', { filename: 'manifest.json', data: manifest });
		await invoke('write', { filename: 'visual-source.css', data: css });
		await invoke('write', { filename: 'visual-source.json', data: json });
	}
};
