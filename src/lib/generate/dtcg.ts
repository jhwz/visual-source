import type {
	Spec,
	Theme,
	ThemeTokenOverride,
	Token,
	TokenGroup,
	Palette
} from '$lib/spec.js';
import { kebabCase } from 'change-case';

type DTCGToken = {
	$value: string;
	$type?: string;
	$description?: string;
};
type DTCGNode = DTCGToken | { [key: string]: DTCGNode };

export function generate_dtcg(spec: Spec): string {
	const out: Record<string, DTCGNode | Record<string, DTCGNode>> = {};

	const colorSection: Record<string, DTCGNode> = {};

	// Palettes go under color.palettes so they don't collide with group / token names.
	const palettesSection: Record<string, Record<string, DTCGToken>> = {};
	for (const p of spec.color.palettes) {
		const slug = kebabCase(p.name);
		const palette: Record<string, DTCGToken> = {};
		p.colors.forEach((c, i) => {
			palette[pad(i + 1)] = { $type: 'color', $value: c };
		});
		palettesSection[slug] = palette;
	}
	if (Object.keys(palettesSection).length) {
		colorSection.palettes = palettesSection as unknown as DTCGNode;
	}

	const ref_to_dtcg = make_ref_resolver(spec.color.palettes);

	// Color tokens — bucket by group, ungrouped at the top.
	const colorTokenGroup = invert_groups(spec.color.tokens, spec.color.groups);
	for (const t of spec.color.tokens) {
		const groupName = colorTokenGroup.get(t.id);
		const slug = kebabCase(t.name);
		const tokenObj = build_token(t, 'color', ref_to_dtcg);
		place(colorSection, groupName, slug, tokenObj);
	}

	if (Object.keys(colorSection).length) out.color = colorSection;

	// Spacing — flat, all dimension type.
	if (spec.spacing.scale.length) {
		const spacingSection: Record<string, DTCGToken> = {};
		for (const t of spec.spacing.scale) {
			spacingSection[kebabCase(t.name)] = build_token(t, 'dimension', ref_to_dtcg);
		}
		out.spacing = spacingSection as unknown as DTCGNode;
	}

	// General — bucket by group like color, but no fixed $type.
	if (spec.general?.tokens?.length) {
		const generalSection: Record<string, DTCGNode> = {};
		const generalTokenGroup = invert_groups(spec.general.tokens, spec.general.groups);
		for (const t of spec.general.tokens) {
			const groupName = generalTokenGroup.get(t.id);
			const slug = kebabCase(t.name);
			const tokenObj = build_token(t, null, ref_to_dtcg);
			place(generalSection, groupName, slug, tokenObj);
		}
		out.general = generalSection;
	}

	// Themes go under $extensions because DTCG hasn't standardised mode/theme yet.
	if (spec.themes.length) {
		const themesExt: Record<string, Record<string, DTCGNode>> = {};
		for (const theme of spec.themes) {
			const themeOut: Record<string, DTCGNode> = {};

			if (theme.tokens.length) {
				const colorOverrides: Record<string, DTCGNode> = {};
				for (const o of theme.tokens) {
					const base = spec.color.tokens.find((t) => t.id === o.tokenId);
					if (!base) continue;
					const groupName = colorTokenGroup.get(base.id);
					const slug = kebabCase(base.name);
					place(colorOverrides, groupName, slug, build_override(o, ref_to_dtcg));
				}
				if (Object.keys(colorOverrides).length) themeOut.color = colorOverrides;
			}

			if (theme.spacing.length) {
				const spacingOverrides: Record<string, DTCGToken> = {};
				for (const o of theme.spacing) {
					const base = spec.spacing.scale.find((t) => t.id === o.tokenId);
					if (!base) continue;
					spacingOverrides[kebabCase(base.name)] = build_override(o, ref_to_dtcg);
				}
				if (Object.keys(spacingOverrides).length) {
					themeOut.spacing = spacingOverrides as unknown as DTCGNode;
				}
			}

			if (theme.general?.length && spec.general?.tokens) {
				const generalTokenGroup = invert_groups(spec.general.tokens, spec.general.groups);
				const generalOverrides: Record<string, DTCGNode> = {};
				for (const o of theme.general) {
					const base = spec.general.tokens.find((t) => t.id === o.tokenId);
					if (!base) continue;
					const groupName = generalTokenGroup.get(base.id);
					const slug = kebabCase(base.name);
					place(generalOverrides, groupName, slug, build_override(o, ref_to_dtcg));
				}
				if (Object.keys(generalOverrides).length) themeOut.general = generalOverrides;
			}

			if (Object.keys(themeOut).length) themesExt[theme.name] = themeOut;
		}
		if (Object.keys(themesExt).length) {
			out.$extensions = { 'com.visualsource.themes': themesExt as unknown as DTCGNode };
		}
	}

	return JSON.stringify(out, null, 2);
}

function pad(n: number): string {
	return n.toString().padStart(2, '0');
}

function invert_groups(tokens: Token[], groups: TokenGroup[]): Map<number, string | null> {
	const map = new Map<number, string | null>();
	for (const t of tokens) map.set(t.id, null);
	for (const g of groups) {
		const slug = kebabCase(g.name);
		for (const id of g.tokens) map.set(id, slug);
	}
	return map;
}

function make_ref_resolver(palettes: Palette[]): (ref: string) => string {
	return (ref) => {
		const parts = ref.split('/');
		// "#/color/palettes/<id>/colors/<index>"
		const paletteId = parseInt(parts[3]);
		const colorIndex = parseInt(parts[5]);
		const palette = palettes.find((p) => p.id === paletteId);
		if (!palette) return ref;
		return `{color.palettes.${kebabCase(palette.name)}.${pad(colorIndex + 1)}}`;
	};
}

function build_token(
	t: Token,
	type: string | null,
	ref_to_dtcg: (ref: string) => string
): DTCGToken {
	const obj: DTCGToken = { $value: token_dtcg_value(t, ref_to_dtcg) };
	if (type) obj.$type = type;
	if (t.description) obj.$description = t.description;
	return obj;
}

function build_override(
	o: ThemeTokenOverride,
	ref_to_dtcg: (ref: string) => string
): DTCGToken {
	if (typeof o.value === 'string') return { $value: o.value };
	if (o.$ref) return { $value: ref_to_dtcg(o.$ref) };
	return { $value: '' };
}

function token_dtcg_value(t: Token, ref_to_dtcg: (ref: string) => string): string {
	if (typeof t.value === 'string') return t.value;
	if (t.$ref) return ref_to_dtcg(t.$ref);
	return '';
}

function place(
	section: Record<string, DTCGNode>,
	groupName: string | null | undefined,
	slug: string,
	tokenObj: DTCGToken
) {
	if (groupName) {
		const existing = section[groupName];
		if (existing && !is_token(existing)) {
			(existing as Record<string, DTCGNode>)[slug] = tokenObj;
		} else {
			section[groupName] = { [slug]: tokenObj };
		}
	} else {
		section[slug] = tokenObj;
	}
}

function is_token(node: DTCGNode): node is DTCGToken {
	return typeof (node as DTCGToken).$value === 'string';
}
