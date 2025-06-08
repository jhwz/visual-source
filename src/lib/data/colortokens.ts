export const exampleColorTokens = {
	tokens: [
		{ id: 17, name: 'Success', value: '#00aa00' },
		{ id: 1, name: 'Background', value: '#202429' },
		{ id: 8, name: 'Border', value: '#424953' },
		{ id: 9, name: 'Hover', value: '#333941' },
		{ id: 2, name: 'Text 01', value: '#e2e8ef' },
		{ id: 10, name: 'Text 02', value: '#b6bec6' },
		{ id: 11, name: 'Surface', value: '#333941' },
		{ id: 13, name: 'Border', value: '#58626e' },
		{ id: 12, name: 'Hover', value: '#424953' },
		{ id: 14, name: 'Text 01', value: '#fbfdff' },
		{ id: 15, name: 'Text 02', value: '#ced4da' },
		{ id: 3, name: 'Primary', value: '#b74e22' },
		{ id: 5, name: 'Hover', value: '#d35f33' },
		{ id: 7, name: 'Disabled', value: '#f1aa82' },
		{ id: 4, name: 'Text 01', value: '#fbe8de' },
		{ id: 16, name: 'Disabled Text 01', value: '#f2d0bd' },
		{ id: 18, name: 'Field', value: '#424953' },
		{ id: 19, name: 'Text 01', value: '#eff4fa' },
		{ id: 20, name: 'Border', value: '#e2e8ef' },
		{ id: 21, name: 'Readonly Text', value: '#959fa8' },
		{ id: 22, name: 'Error', value: '#77130e' },
		{ id: 23, name: 'Text 01', value: '#e2e8ef' },
		{ id: 24, name: 'Hover', value: '#892827' },
		{ id: 25, name: 'Disabled', value: '#a8504f' },
		{ id: 26, name: 'Disabled Text 01', value: '#d89f9c' }
	],

	groups: [
		{
			id: 1,
			name: 'Background',
			css: { prefix: 'bg-' },
			tokens: [1, 8, 9, 2, 10],
			description: 'Neutral colors to be used as the default look in the UI'
		},
		{
			id: 2,
			name: 'Surface',
			tokens: [11, 13, 12, 14, 15],
			css: { prefix: 'surface-' },
			description: 'Colors to be used on surfaces, e.g. modals, dropdowns, cards etc'
		},
		{
			id: 3,
			name: 'Primary',
			tokens: [3, 5, 7, 4, 16],
			css: { prefix: 'primary-' },
			description:
				'Primary color to be used on actionable items, or when you want to draw the users focus'
		},
		{
			id: 4,
			name: 'Field',
			tokens: [18, 19, 20, 21],
			description: 'Colors to be used when styling form elements',
			css: { prefix: 'field-' }
		},
		{
			id: 5,
			name: 'Error',
			tokens: [22, 23, 24, 25, 26],
			description:
				'Error color to be used when for danger states, or for drawing the users focus to issues',
			css: { prefix: 'error-' }
		}
	]
};
