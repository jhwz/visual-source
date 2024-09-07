import { invoke } from '@tauri-apps/api/core';
import type { PageLoad } from './$types.js';
import type { Palette } from '$lib/palette.js';

export const load: PageLoad = async () => {
	const data: Palette[] = JSON.parse(await invoke('get')) || [];
	return {
		palettes: data
	};
};
