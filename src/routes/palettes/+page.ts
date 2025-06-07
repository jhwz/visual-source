import type { PageLoad } from './$types.js';

export const load: PageLoad = async ({ url }) => {
	const idStr = url.searchParams.get('id');
	if (!idStr) throw new Error('id parameter required');
	return { id: parseInt(idStr) };
};
