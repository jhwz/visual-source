export function next_id(items: { id: number }[]): number {
	return Math.max(...items.map((t) => t.id), 0) + 1;
}

export function find_by_id<T extends { id: number }>(items: T[], id: number): T {
	const item = items.find((i) => i.id === id);
	if (!item) throw new Error(`Internal error: item missing`);
	return item;
}
