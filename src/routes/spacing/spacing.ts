/** Parse a CSS length string (px/rem/em) into a pixel number. */
export function parse_px(v: string): number {
	const trimmed = v.trim();
	const num = parseFloat(trimmed);
	if (Number.isNaN(num)) return 0;
	if (trimmed.endsWith('rem') || trimmed.endsWith('em')) return num * 16;
	return num;
}
