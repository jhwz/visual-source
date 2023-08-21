type Vec3 = [number, number, number];

export function hex_to_rgb(hex: string): Vec3 {
	const r = parseInt(hex.slice(1, 3), 16);
	const g = parseInt(hex.slice(3, 5), 16);
	const b = parseInt(hex.slice(5, 7), 16);

	return [r, g, b];
}

export function rgb_to_hex([R, G, B]: Vec3): string {
	const fmt = (x: number) => Math.round(x).toString(16).padStart(2, '0');

	return `#${fmt(R)}${fmt(G)}${fmt(B)}`;
}

export function rgb_to_hsv([r, g, b]: Vec3): Vec3 {
	(r /= 255), (g /= 255), (b /= 255);

	const max = Math.max(r, g, b),
		min = Math.min(r, g, b);

	let h = 0;

	const d = max - min;
	const s = max == 0 ? 0 : d / max;
	const v = max;

	// not achromatic
	if (max != min) {
		switch (max) {
			case r:
				h = (g - b) / d + (g < b ? 6 : 0);
				break;
			case g:
				h = (b - r) / d + 2;
				break;
			case b:
				h = (r - g) / d + 4;
				break;
		}

		h /= 6;
	}

	return [h, s, v];
}

export function hsv_to_rgb([h, s, v]: Vec3): Vec3 {
	let r = 0,
		g = 0,
		b = 0;

	const i = Math.floor(h * 6);
	const f = h * 6 - i;
	const p = v * (1 - s);
	const q = v * (1 - f * s);
	const t = v * (1 - (1 - f) * s);

	switch (i % 6) {
		case 0:
			(r = v), (g = t), (b = p);
			break;
		case 1:
			(r = q), (g = v), (b = p);
			break;
		case 2:
			(r = p), (g = v), (b = t);
			break;
		case 3:
			(r = p), (g = q), (b = v);
			break;
		case 4:
			(r = t), (g = p), (b = v);
			break;
		case 5:
			(r = v), (g = p), (b = q);
			break;
	}

	return [r * 255, g * 255, b * 255];
}
