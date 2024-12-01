import '$lib/css/app.css';
import { invoke } from '@tauri-apps/api/core';
import type { LayoutLoad } from './$types.js';

export const prerender = true;
export const ssr = false;

export const load: LayoutLoad = async () => {
	const filename: string = await invoke('filename');
	return { filename };
};
