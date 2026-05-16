type Group<T> = { tokens: T[] };

/**
 * Move a token between groups by id. The token object is removed from its
 * current group (if any) and inserted into the destination. Does not touch
 * anything other than the groups themselves — theme overrides keyed by id
 * remain valid because the id is unchanged.
 *
 * `position` inserts at that index inside the destination; omit it to append.
 */
export function move_token<T extends { id: number }>(
	groups: Group<T>[],
	tokenId: number,
	targetIndex: number,
	position?: number
): boolean {
	if (targetIndex < 0 || targetIndex >= groups.length) return false;
	for (const g of groups) {
		const idx = g.tokens.findIndex((t) => t.id === tokenId);
		if (idx >= 0) {
			const [t] = g.tokens.splice(idx, 1);
			const dest = groups[targetIndex];
			if (position !== undefined && position >= 0) {
				dest.tokens.splice(position, 0, t);
			} else {
				dest.tokens.push(t);
			}
			return true;
		}
	}
	return false;
}
