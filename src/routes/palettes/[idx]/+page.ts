import type { PageLoad } from './$types.js';

export const load: PageLoad = async ({ params }) => {
	const idx = parseInt(params.idx);
	return { idx };
};
