import type { Spec } from '../spec.js';

export type TokenSection = 'color' | 'general' | 'spacing';

/**
 * Remove every theme override that references `tokenId` within the given
 * section. Color tokens are overridden via `theme.tokens`, general via
 * `theme.general`, spacing via `theme.spacing`.
 *
 * Call this after removing a token so theme entries don't dangle. Moves do
 * NOT need this — the token id is preserved across a move.
 */
export function cleanup_token_overrides(
	spec: Spec,
	section: TokenSection,
	tokenId: number
): void {
	for (const theme of spec.themes) {
		if (section === 'color') {
			theme.tokens = theme.tokens.filter((o) => o.tokenId !== tokenId);
		} else if (section === 'general') {
			theme.general = theme.general.filter((o) => o.tokenId !== tokenId);
		} else {
			theme.spacing = theme.spacing.filter((o) => o.tokenId !== tokenId);
		}
	}
}
