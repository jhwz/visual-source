import { browser_storage } from './browser.js';
import { tauri_storage } from './tauri.js';

export type Environment = 'tauri' | 'browser';

export type StorageOutputs = {
	manifest: string;
	css: string;
	json: string;
};

export interface Storage {
	load_manifest(): Promise<string | null>;
	write_outputs(outputs: StorageOutputs): Promise<void>;
}

function whats_the_environment(): Environment {
	if (typeof window !== 'undefined' && '__TAURI_INTERNALS__' in window) {
		return 'tauri';
	}
	return 'browser';
}

export const environment: Environment = whats_the_environment();

export const storage: Storage = environment === 'tauri' ? tauri_storage : browser_storage;
