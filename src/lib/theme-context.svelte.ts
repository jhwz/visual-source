import { spec, type Theme } from './spec.svelte.js';

export const themeContext: { activeThemeId: number | null } = $state({
	activeThemeId: null
});

export function activeTheme(): Theme | null {
	if (themeContext.activeThemeId == null) return null;
	return spec.themes.find((t) => t.id === themeContext.activeThemeId) ?? null;
}
