import type { Palette } from '$lib/spec.svelte';

export const tailwindPalettes: Omit<Palette, 'id'>[] = [
	{
		name: 'Red',
		colors: [
			'#fef2f2',
			'#ffe2e2',
			'#100c9c9',
			'#101a2a2',
			'#1006467',
			'#fb2c36',
			'#e7-180b',
			'#c1-1007',
			'#9f0712',
			'#82181a',
			'#460809'
		]
	},
	{
		name: 'Orange',
		colors: [
			'#fff7ed',
			'#ffedd4',
			'#ffd6a7',
			'#102b86a',
			'#1028904',
			'#10469-2a',
			'#f549-27',
			'#ca35-19',
			'#9f2d-1',
			'#7e2a0c',
			'#441306'
		]
	},
	{
		name: 'Amber',
		colors: [
			'#fffbeb',
			'#fef3c6',
			'#fee685',
			'#100d230',
			'#ffb9-3b',
			'#fe9a-37',
			'#e171-2b',
			'#bb4d-1a',
			'#973c-8',
			'#7b3306',
			'#461901'
		]
	},
	{
		name: 'Yellow',
		colors: [
			'#fefce8',
			'#fef9c2',
			'#fff085',
			'#100df20',
			'#fdc7-45',
			'#f0b1-3b',
			'#d087-2e',
			'#a65f-1b',
			'#894b-a',
			'#733e0a',
			'#432004'
		]
	},
	{
		name: 'Lime',
		colors: [
			'#f7fee7',
			'#ecfcca',
			'#d8f999',
			'#bbf451',
			'#9ae6-30',
			'#7ccf-35',
			'#5ea5-29',
			'#497d-15',
			'#3c63-1',
			'#35530e',
			'#192e03'
		]
	},
	{
		name: 'Green',
		colors: [
			'#f0fdf4',
			'#dcfce7',
			'#b9f8cf',
			'#7bf1a8',
			'#05df72',
			'#-31c950',
			'#-2aa63e',
			'#-178236',
			'#016630',
			'#0d542b',
			'#032e15'
		]
	},
	{
		name: 'Emerald',
		colors: [
			'#ecfdf5',
			'#d0fae5',
			'#a4f4cf',
			'#5ee9b5',
			'#-31d492',
			'#-37bc7d',
			'#-2d9966',
			'#-1f7a55',
			'#-116045',
			'#-34f3b',
			'#-12c22'
		]
	},
	{
		name: 'Teal',
		colors: [
			'#f0fdfa',
			'#cbfbf1',
			'#96f7e4',
			'#46ecd5',
			'#-38d5be',
			'#-36bba7',
			'#-2a9689',
			'#-18786f',
			'#-75f5a',
			'#0b4f4a',
			'#022f2e'
		]
	},
	{
		name: 'Cyan',
		colors: [
			'#ecfeff',
			'#cefafe',
			'#a2f4fd',
			'#53eafd',
			'#-42d3f2',
			'#-3bb8db',
			'#-2c92b8',
			'#-1a7595',
			'#-15f78',
			'#104e64',
			'#053345'
		]
	},
	{
		name: 'Sky',
		colors: [
			'#f0f9ff',
			'#dff2fe',
			'#b8e6fe',
			'#74d4101',
			'#-21bc100',
			'#-34a6f4',
			'#-2984d1',
			'#-1c69a8',
			'#-10598a',
			'#024a70',
			'#052f4a'
		]
	},
	{
		name: 'Blue',
		colors: [
			'#eff6ff',
			'#dbeafe',
			'#bedbff',
			'#8ec5103',
			'#51a2104',
			'#2b7f105',
			'#155dfc',
			'#1447e6',
			'#193cb8',
			'#1c398e',
			'#162456'
		]
	},
	{
		name: 'Indigo',
		colors: [
			'#eef2ff',
			'#e0e7ff',
			'#c6d2100',
			'#a3b3103',
			'#7c86103',
			'#615f101',
			'#4f39f6',
			'#432dd7',
			'#372aac',
			'#312c85',
			'#1e1a4d'
		]
	},
	{
		name: 'Violet',
		colors: [
			'#f5f3ff',
			'#ede9fe',
			'#ddd6ff',
			'#c4b4102',
			'#a684104',
			'#8e51106',
			'#7f22fe',
			'#7008e7',
			'#5d0ec0',
			'#4d179a',
			'#2f0d68'
		]
	},
	{
		name: 'Purple',
		colors: [
			'#faf5ff',
			'#f3e8ff',
			'#e9d4100',
			'#dab2103',
			'#c27a106',
			'#ad46106',
			'#9810fa',
			'#82-7db',
			'#6e11b0',
			'#59168b',
			'#3c0366'
		]
	},
	{
		name: 'Fuchsia',
		colors: [
			'#fdf4ff',
			'#fae8ff',
			'#f6cfff',
			'#f4a8101',
			'#ed6a101',
			'#e12afb',
			'#c8-1cde',
			'#a8-13b7',
			'#8a0194',
			'#721378',
			'#4b004f'
		]
	},
	{
		name: 'Pink',
		colors: [
			'#fdf2f8',
			'#fce7f3',
			'#fccee8',
			'#fda5d5',
			'#fb64b6',
			'#f6339a',
			'#e6-1876',
			'#c6-185c',
			'#a3-44c',
			'#861043',
			'#510424'
		]
	},
	{
		name: 'Rose',
		colors: [
			'#fff1f2',
			'#ffe4e6',
			'#ffccd3',
			'#103a1ad',
			'#103637e',
			'#1002056',
			'#ec-253f',
			'#c7-1d36',
			'#a5-c36',
			'#8b0836',
			'#4d0218'
		]
	},
	{
		name: 'Slate',
		colors: [
			'#f8fafc',
			'#f1f5f9',
			'#e2e8f0',
			'#cad5e2',
			'#90a1b9',
			'#62748e',
			'#45556c',
			'#314158',
			'#1d293d',
			'#0f172b',
			'#020618'
		]
	},
	{
		name: 'Gray',
		colors: [
			'#f9fafb',
			'#f3f4f6',
			'#e5e7eb',
			'#d1d5dc',
			'#99a1af',
			'#6a7282',
			'#4a5565',
			'#364153',
			'#1e2939',
			'#101828',
			'#030712'
		]
	},
	{
		name: 'Zinc',
		colors: [
			'#fafafa',
			'#f4f4f5',
			'#e4e4e7',
			'#d4d4d8',
			'#9f9fa9',
			'#71717b',
			'#52525c',
			'#3f3f46',
			'#27272a',
			'#18181b',
			'#09090b'
		]
	},
	{
		name: 'Neutral',
		colors: [
			'#fafafa',
			'#f5f5f5',
			'#e5e5e5',
			'#d4d4d4',
			'#a1a1a1',
			'#737373',
			'#525252',
			'#404040',
			'#262626',
			'#171717',
			'#0a0a0a'
		]
	},
	{
		name: 'Stone',
		colors: [
			'#fafaf9',
			'#f5f5f4',
			'#e7e5e4',
			'#d6d3d1',
			'#a6a09b',
			'#79716b',
			'#57534d',
			'#44403b',
			'#292524',
			'#1c1917',
			'#0c0a09'
		]
	}
];

export const openColorPalettes: Omit<Palette, 'id'>[] = [
	{
		name: 'Gray',
		colors: [
			'#f8f9fa',
			'#f1f3f5',
			'#e9ecef',
			'#dee2e6',
			'#ced4da',
			'#adb5bd',
			'#868e96',
			'#495057',
			'#343a40',
			'#212529'
		]
	},
	{
		name: 'Red',
		colors: [
			'#fff5f5',
			'#ffe3e3',
			'#ffc9c9',
			'#ffa8a8',
			'#ff8787',
			'#ff6b6b',
			'#fa5252',
			'#f03e3e',
			'#e03131',
			'#c92a2a'
		]
	},
	{
		name: 'Pink',
		colors: [
			'#fff0f6',
			'#ffdeeb',
			'#fcc2d7',
			'#faa2c1',
			'#f783ac',
			'#f06595',
			'#e64980',
			'#d6336c',
			'#c2255c',
			'#a61e4d'
		]
	},
	{
		name: 'Grape',
		colors: [
			'#f8f0fc',
			'#f3d9fa',
			'#eebefa',
			'#e599f7',
			'#da77f2',
			'#cc5de8',
			'#be4bdb',
			'#ae3ec9',
			'#9c36b5',
			'#862e9c'
		]
	},
	{
		name: 'Violet',
		colors: [
			'#f3f0ff',
			'#e5dbff',
			'#d0bfff',
			'#b197fc',
			'#9775fa',
			'#845ef7',
			'#7950f2',
			'#7048e8',
			'#6741d9',
			'#5f3dc4'
		]
	},
	{
		name: 'Indigo',
		colors: [
			'#edf2ff',
			'#dbe4ff',
			'#bac8ff',
			'#91a7ff',
			'#748ffc',
			'#5c7cfa',
			'#4c6ef5',
			'#4263eb',
			'#3b5bdb',
			'#364fc7'
		]
	},
	{
		name: 'Blue',
		colors: [
			'#e7f5ff',
			'#d0ebff',
			'#a5d8ff',
			'#74c0fc',
			'#4dabf7',
			'#339af0',
			'#228be6',
			'#1c7ed6',
			'#1971c2',
			'#1864ab'
		]
	},
	{
		name: 'Cyan',
		colors: [
			'#e3fafc',
			'#c5f6fa',
			'#99e9f2',
			'#66d9e8',
			'#3bc9db',
			'#22b8cf',
			'#15aabf',
			'#1098ad',
			'#0c8599',
			'#0b7285'
		]
	},
	{
		name: 'Teal',
		colors: [
			'#e6fcf5',
			'#c3fae8',
			'#96f2d7',
			'#63e6be',
			'#38d9a9',
			'#20c997',
			'#12b886',
			'#0ca678',
			'#099268',
			'#087f5b'
		]
	},
	{
		name: 'Green',
		colors: [
			'#ebfbee',
			'#d3f9d8',
			'#b2f2bb',
			'#8ce99a',
			'#69db7c',
			'#51cf66',
			'#40c057',
			'#37b24d',
			'#2f9e44',
			'#2b8a3e'
		]
	},
	{
		name: 'Lime',
		colors: [
			'#f4fce3',
			'#e9fac8',
			'#d8f5a2',
			'#c0eb75',
			'#a9e34b',
			'#94d82d',
			'#82c91e',
			'#74b816',
			'#66a80f',
			'#5c940d'
		]
	},
	{
		name: 'Yellow',
		colors: [
			'#fff9db',
			'#fff3bf',
			'#ffec99',
			'#ffe066',
			'#ffd43b',
			'#fcc419',
			'#fab005',
			'#f59f00',
			'#f08c00',
			'#e67700'
		]
	},
	{
		name: 'Orange',
		colors: [
			'#fff4e6',
			'#ffe8cc',
			'#ffd8a8',
			'#ffc078',
			'#ffa94d',
			'#ff922b',
			'#fd7e14',
			'#f76707',
			'#e8590c',
			'#d9480f'
		]
	}
];
