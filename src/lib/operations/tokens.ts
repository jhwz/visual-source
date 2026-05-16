import type { Spec } from '../spec.js';
import { cleanup_token_overrides } from './shared.js';

type Section = 'color' | 'general';

/**
 * Delete a color or general token. Removes it from `spec.{section}.tokens`,
 * unlinks it from every group's id list in that section, and drops any theme
 * overrides keyed by it.
 */
export function delete_token(spec: Spec, section: Section, id: number): void {
	const s = spec[section];
	s.tokens = s.tokens.filter((t) => t.id !== id);
	for (const g of s.groups) {
		g.tokens = g.tokens.filter((tid) => tid !== id);
	}
	cleanup_token_overrides(spec, section, id);
}

/**
 * Delete a group and every token that belongs to it. Theme overrides for the
 * removed tokens are also cleaned up. No-op if the group doesn't exist.
 */
export function delete_group(spec: Spec, section: Section, groupId: number): void {
	const s = spec[section];
	const group = s.groups.find((g) => g.id === groupId);
	if (!group) return;
	const tokenIds = new Set(group.tokens);
	s.tokens = s.tokens.filter((t) => !tokenIds.has(t.id));
	s.groups = s.groups.filter((g) => g.id !== groupId);
	for (const id of tokenIds) cleanup_token_overrides(spec, section, id);
}
