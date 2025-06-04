import type { Token } from '$lib/spec.svelte';

export const tailwindSpacing: Token[] = [
	{ name: 'sp-0p5', value: '2px' },
	{ name: 'sp-01', value: '4px' },
	{ name: 'sp-01p5', value: '6px' },
	{ name: 'sp-02', value: '8px' },
	{ name: 'sp-02p5', value: '10px' },
	{ name: 'sp-03', value: '12px' },
	{ name: 'sp-03p5', value: '14px' },
	{ name: 'sp-04', value: '16px' },
	{ name: 'sp-05', value: '20px' },
	{ name: 'sp-06', value: '24px' },
	{ name: 'sp-07', value: '28px' },
	{ name: 'sp-08', value: '32px' },
	{ name: 'sp-09', value: '36px' },
	{ name: 'sp-10', value: '40px' },
	{ name: 'sp-11', value: '44px' },
	{ name: 'sp-12', value: '48px' },
	{ name: 'sp-14', value: '56px' },
	{ name: 'sp-16', value: '64px' },
	{ name: 'sp-20', value: '80px' },
	{ name: 'sp-24', value: '96px' },
	{ name: 'sp-28', value: '112px' },
	{ name: 'sp-32', value: '128px' },
	{ name: 'sp-36', value: '144px' },
	{ name: 'sp-40', value: '160px' },
	{ name: 'sp-44', value: '176px' },
	{ name: 'sp-48', value: '192px' },
	{ name: 'sp-52', value: '208px' },
	{ name: 'sp-56', value: '224px' },
	{ name: 'sp-60', value: '240px' },
	{ name: 'sp-64', value: '256px' },
	{ name: 'sp-72', value: '288px' },
	{ name: 'sp-80', value: '320px' },
	{ name: 'sp-96', value: '384px' }
].map((v, i) => ({ ...v, id: i + 1 }));

































