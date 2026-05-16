import type { $RefType } from '../reftype.js';
import type { Spec } from '../spec.js';
import type { TokenSection } from './shared.js';

type $Ref = $RefType<Spec>;

/** Delete a theme. No-op if the theme doesn't exist. */
export function delete_theme(spec: Spec, themeId: number): void {
	spec.themes = spec.themes.filter((t) => t.id !== themeId);
}

/**
 * Set (or update) a theme override for a token. Idempotent: if an override
 * already exists for `tokenId` in the given section, it's updated in place;
 * otherwise a new entry is pushed. `value` and `$ref` are mutually exclusive
 * — the override has whichever was provided, the other field is cleared.
 */
export function set_override(
	spec: Spec,
	themeId: number,
	section: TokenSection,
	tokenId: number,
	override: { value?: string; $ref?: $Ref }
): void {
	const theme = spec.themes.find((t) => t.id === themeId);
	if (!theme) return;
	const list = section_list(theme, section);
	const existing = list.find((o) => o.tokenId === tokenId);
	if (existing) {
		existing.value = override.value;
		existing.$ref = override.$ref;
	} else {
		list.push({ tokenId, value: override.value, $ref: override.$ref });
	}
}

/** Remove a theme override. No-op if the override doesn't exist. */
export function clear_override(
	spec: Spec,
	themeId: number,
	section: TokenSection,
	tokenId: number
): void {
	const theme = spec.themes.find((t) => t.id === themeId);
	if (!theme) return;
	if (section === 'color') {
		theme.tokens = theme.tokens.filter((o) => o.tokenId !== tokenId);
	} else if (section === 'general') {
		theme.general = theme.general.filter((o) => o.tokenId !== tokenId);
	} else {
		theme.spacing = theme.spacing.filter((o) => o.tokenId !== tokenId);
	}
}

function section_list(
	theme: Spec['themes'][number],
	section: TokenSection
): Spec['themes'][number]['tokens'] {
	if (section === 'color') return theme.tokens;
	if (section === 'general') return theme.general;
	return theme.spacing;
}
