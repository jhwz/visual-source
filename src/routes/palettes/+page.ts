import type { PageLoad } from './$types.js';

export const load: PageLoad = async ({ url }) => {
	const idx = parseInt(url.searchParams.get('idx') || '0');
	return { idx };
};
