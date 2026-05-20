import { invoke } from '@tauri-apps/api/core';
import { AGENT_INSTRUCTIONS } from '../agent-instructions.js';
import type { Storage, StorageOutputs } from './index.js';

export const tauri_storage: Storage = {
	async load_manifest() {
		return await invoke<string>('get');
	},
	async write_outputs({ manifest, css, json }: StorageOutputs) {
		await invoke('write_outputs', {
			manifest,
			css,
			json,
			agents: AGENT_INSTRUCTIONS
		});
	}
};
