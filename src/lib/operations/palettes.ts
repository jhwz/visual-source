import type { $RefType } from '../reftype.js';
import type { Spec, ThemeTokenOverride, Token } from '../spec.js';

type $Ref = $RefType<Spec>;
type RefHolder = Token | ThemeTokenOverride;

const REF_PATTERN = /^#\/color\/palettes\/(\d+)\/colors\/(\d+)$/;

function parse_palette_ref(ref: string): { paletteId: number; index: number } | null {
	const m = ref.match(REF_PATTERN);
	if (!m) return null;
	return { paletteId: parseInt(m[1], 10), index: parseInt(m[2], 10) };
}

function make_ref(paletteId: number, index: number): $Ref {
	return `#/color/palettes/${paletteId}/colors/${index}` as $Ref;
}

/** Visit every slot in `spec` that may hold a `$ref` pointing at a palette color. */
function for_each_ref_holder(spec: Spec, fn: (holder: RefHolder) => void): void {
	for (const t of spec.color.tokens) fn(t);
	for (const theme of spec.themes) {
		for (const o of theme.tokens) fn(o);
		for (const o of theme.general) fn(o);
		for (const o of theme.spacing) fn(o);
	}
}

function materialize(holder: RefHolder, value: string): void {
	holder.$ref = undefined;
	holder.value = value;
}

/**
 * Delete a palette. Every `$ref` pointing into it is replaced with the resolved
 * literal value so dependent tokens/overrides keep rendering the same color.
 * No-op if the palette doesn't exist.
 */
export function delete_palette(spec: Spec, paletteId: number): void {
	const palette = spec.color.palettes.find((p) => p.id === paletteId);
	if (!palette) return;

	for_each_ref_holder(spec, (holder) => {
		if (!holder.$ref) return;
		const parsed = parse_palette_ref(holder.$ref);
		if (!parsed || parsed.paletteId !== paletteId) return;
		// Use the palette we're about to delete for the resolved value; fall
		// back to '#000000' if the index was already out of range.
		const value = palette.colors[parsed.index] ?? '#000000';
		materialize(holder, value);
	});

	spec.color.palettes = spec.color.palettes.filter((p) => p.id !== paletteId);
}

/**
 * Delete a color at `index` in palette `paletteId`. `$ref`s pointing at that
 * exact slot are materialized to the removed value; `$ref`s pointing past it
 * are shifted down by one to track the new array layout.
 */
export function delete_color(spec: Spec, paletteId: number, index: number): void {
	const palette = spec.color.palettes.find((p) => p.id === paletteId);
	if (!palette) return;
	if (index < 0 || index >= palette.colors.length) return;

	const removed = palette.colors[index];

	for_each_ref_holder(spec, (holder) => {
		if (!holder.$ref) return;
		const parsed = parse_palette_ref(holder.$ref);
		if (!parsed || parsed.paletteId !== paletteId) return;

		if (parsed.index === index) {
			materialize(holder, removed);
		} else if (parsed.index > index) {
			holder.$ref = make_ref(paletteId, parsed.index - 1);
		}
	});

	palette.colors.splice(index, 1);
}

/**
 * Move a color within a palette from `fromIndex` to `toIndex` (both indices in
 * the pre-move array). `$ref`s tracking the moved color follow it; `$ref`s to
 * indices shifted by the move are rewritten to match the new layout.
 */
export function move_color(
	spec: Spec,
	paletteId: number,
	fromIndex: number,
	toIndex: number
): void {
	const palette = spec.color.palettes.find((p) => p.id === paletteId);
	if (!palette) return;
	if (fromIndex < 0 || fromIndex >= palette.colors.length) return;
	if (toIndex < 0 || toIndex >= palette.colors.length) return;
	if (fromIndex === toIndex) return;

	const [moved] = palette.colors.splice(fromIndex, 1);
	palette.colors.splice(toIndex, 0, moved);

	for_each_ref_holder(spec, (holder) => {
		if (!holder.$ref) return;
		const parsed = parse_palette_ref(holder.$ref);
		if (!parsed || parsed.paletteId !== paletteId) return;

		let next: number;
		if (parsed.index === fromIndex) {
			next = toIndex;
		} else if (fromIndex < toIndex) {
			// Forward move: indices in (fromIndex, toIndex] shift down by one.
			next =
				parsed.index > fromIndex && parsed.index <= toIndex ? parsed.index - 1 : parsed.index;
		} else {
			// Backward move: indices in [toIndex, fromIndex) shift up by one.
			next =
				parsed.index >= toIndex && parsed.index < fromIndex ? parsed.index + 1 : parsed.index;
		}

		if (next !== parsed.index) {
			holder.$ref = make_ref(paletteId, next);
		}
	});
}
