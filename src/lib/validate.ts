import { token_css_name } from './generate/css.js';

export type ValidationError = {
	path: string;
	message: string;
};

export type ValidateResult = {
	errors: ValidationError[];
	warnings: ValidationError[];
};

export function validate(spec: unknown): ValidateResult {
	const errors: ValidationError[] = [];
	const warnings: ValidationError[] = [];

	if (!is_object(spec)) {
		errors.push({ path: '', message: 'manifest must be a JSON object' });
		return { errors, warnings };
	}

	const version = (spec as Record<string, unknown>).version;
	if (version !== 2) {
		if (version === 1 || version === undefined) {
			errors.push({
				path: 'version',
				message: 'expected version 2 — open the GUI once to migrate, then re-run'
			});
		} else {
			errors.push({ path: 'version', message: `unknown version ${JSON.stringify(version)}` });
		}
		return { errors, warnings };
	}

	const root = spec as Record<string, unknown>;

	const color = root.color;
	if (!is_object(color)) {
		errors.push({ path: 'color', message: 'expected an object' });
		return { errors, warnings };
	}
	const palettes = array_at(color, 'palettes', 'color.palettes', errors);
	const color_tokens = array_at(color, 'tokens', 'color.tokens', errors);
	const groups = array_at(color, 'groups', 'color.groups', errors);

	const spacing = root.spacing;
	if (!is_object(spacing)) {
		errors.push({ path: 'spacing', message: 'expected an object' });
		return { errors, warnings };
	}
	const scale = array_at(spacing, 'scale', 'spacing.scale', errors);

	let themes: unknown[] = [];
	if (root.themes === undefined) {
		// allow missing themes, treat as []
	} else if (Array.isArray(root.themes)) {
		themes = root.themes;
	} else {
		errors.push({ path: 'themes', message: 'expected an array' });
	}

	check_entities(palettes, 'color.palettes', errors);
	check_entities(color_tokens, 'color.tokens', errors);
	check_entities(groups, 'color.groups', errors);
	check_entities(scale, 'spacing.scale', errors);
	check_entities(themes, 'themes', errors);

	const palette_index = new Map<number, Record<string, unknown>>();
	for (const p of palettes) {
		if (!is_object(p)) continue;
		const id = p.id;
		if (typeof id === 'number') palette_index.set(id, p);
	}
	const color_token_ids = new Set<number>();
	for (const t of color_tokens) {
		if (!is_object(t)) continue;
		if (typeof t.id === 'number') color_token_ids.add(t.id);
	}
	const scale_ids = new Set<number>();
	for (const t of scale) {
		if (!is_object(t)) continue;
		if (typeof t.id === 'number') scale_ids.add(t.id);
	}

	color_tokens.forEach((t, i) => check_token(t, `color.tokens[${i}]`, palette_index, errors));
	scale.forEach((t, i) => check_token(t, `spacing.scale[${i}]`, palette_index, errors));

	groups.forEach((g, i) => {
		if (!is_object(g)) return;
		const path = `color.groups[${i}]`;
		const token_ids = g.tokens;
		if (!Array.isArray(token_ids)) {
			errors.push({ path: `${path}.tokens`, message: 'expected an array of token IDs' });
			return;
		}
		token_ids.forEach((id_val, j) => {
			if (typeof id_val !== 'number') {
				errors.push({
					path: `${path}.tokens[${j}]`,
					message: 'expected a numeric token ID'
				});
				return;
			}
			if (!color_token_ids.has(id_val)) {
				errors.push({
					path: `${path}.tokens[${j}]`,
					message: `references non-existent color token id ${id_val}`
				});
			}
		});
	});

	themes.forEach((theme, i) => {
		if (!is_object(theme)) return;
		const path = `themes[${i}]`;
		const token_overrides = theme.tokens;
		if (Array.isArray(token_overrides)) {
			token_overrides.forEach((o, j) =>
				check_override(o, `${path}.tokens[${j}]`, color_token_ids, palette_index, errors)
			);
		} else {
			errors.push({ path: `${path}.tokens`, message: 'expected an array' });
		}
		const spacing_overrides = theme.spacing;
		if (Array.isArray(spacing_overrides)) {
			spacing_overrides.forEach((o, j) =>
				check_override(o, `${path}.spacing[${j}]`, scale_ids, palette_index, errors)
			);
		} else {
			errors.push({ path: `${path}.spacing`, message: 'expected an array' });
		}
	});

	check_css_name_collisions(color_tokens, groups, warnings);

	return { errors, warnings };
}

function is_object(v: unknown): v is Record<string, unknown> {
	return typeof v === 'object' && v !== null && !Array.isArray(v);
}

function array_at(
	obj: Record<string, unknown>,
	key: string,
	path: string,
	errors: ValidationError[]
): unknown[] {
	const v = obj[key];
	if (v === undefined) {
		errors.push({ path, message: 'missing' });
		return [];
	}
	if (!Array.isArray(v)) {
		errors.push({ path, message: 'expected an array' });
		return [];
	}
	return v;
}

function check_entities(items: unknown[], collection: string, errors: ValidationError[]) {
	const seen_ids = new Map<number, number>();
	items.forEach((item, i) => {
		const path = `${collection}[${i}]`;
		if (!is_object(item)) {
			errors.push({ path, message: 'expected an object' });
			return;
		}
		const id = item.id;
		if (typeof id !== 'number' || !Number.isInteger(id) || id < 0) {
			errors.push({ path: `${path}.id`, message: 'expected a non-negative integer' });
			return;
		}
		if (typeof item.name !== 'string') {
			errors.push({ path: `${path}.name`, message: 'expected a string' });
		}
		const prev = seen_ids.get(id);
		if (prev !== undefined) {
			errors.push({ path, message: `duplicate id ${id} (also at index ${prev})` });
		} else {
			seen_ids.set(id, i);
		}
	});
}

function check_token(
	token: unknown,
	path: string,
	palettes: Map<number, Record<string, unknown>>,
	errors: ValidationError[]
) {
	if (!is_object(token)) return;
	const has_value = typeof token.value === 'string';
	const has_ref = typeof token.$ref === 'string';
	if (has_value && has_ref) {
		errors.push({ path, message: 'token must have either `value` or `$ref`, not both' });
	} else if (!has_value && !has_ref) {
		errors.push({ path, message: 'token must have either `value` or `$ref`' });
	} else if (has_ref) {
		const msg = check_ref(token.$ref as string, palettes);
		if (msg) errors.push({ path: `${path}.$ref`, message: msg });
	}
}

function check_override(
	o: unknown,
	path: string,
	valid_token_ids: Set<number>,
	palettes: Map<number, Record<string, unknown>>,
	errors: ValidationError[]
) {
	if (!is_object(o)) {
		errors.push({ path, message: 'expected an object' });
		return;
	}
	const tokenId = o.tokenId;
	if (typeof tokenId !== 'number') {
		errors.push({ path: `${path}.tokenId`, message: 'expected a numeric id' });
		return;
	}
	if (!valid_token_ids.has(tokenId)) {
		errors.push({
			path: `${path}.tokenId`,
			message: `references non-existent token id ${tokenId}`
		});
	}
	const has_value = typeof o.value === 'string';
	const has_ref = typeof o.$ref === 'string';
	if (has_value && has_ref) {
		errors.push({ path, message: 'override must have either `value` or `$ref`, not both' });
	} else if (!has_value && !has_ref) {
		errors.push({ path, message: 'override must have either `value` or `$ref`' });
	} else if (has_ref) {
		const msg = check_ref(o.$ref as string, palettes);
		if (msg) errors.push({ path: `${path}.$ref`, message: msg });
	}
}

function check_ref(ref: string, palettes: Map<number, Record<string, unknown>>): string | null {
	if (!ref.startsWith('#/')) {
		return `invalid $ref \`${ref}\`: must start with \`#/\``;
	}
	const parts = ref.slice(2).split('/');
	if (
		parts.length !== 5 ||
		parts[0] !== 'color' ||
		parts[1] !== 'palettes' ||
		parts[3] !== 'colors'
	) {
		return `invalid $ref \`${ref}\`: expected \`#/color/palettes/<id>/colors/<index>\``;
	}
	const palette_id = Number(parts[2]);
	if (!Number.isInteger(palette_id)) {
		return `invalid $ref \`${ref}\`: palette id must be numeric`;
	}
	const index = Number(parts[4]);
	if (!Number.isInteger(index) || index < 0) {
		return `invalid $ref \`${ref}\`: color index must be a non-negative integer`;
	}
	const palette = palettes.get(palette_id);
	if (!palette) {
		return `invalid $ref \`${ref}\`: no palette with id ${palette_id}`;
	}
	const colors = palette.colors;
	const len = Array.isArray(colors) ? colors.length : 0;
	if (index >= len) {
		return `invalid $ref \`${ref}\`: palette ${palette_id} has only ${len} color${len === 1 ? '' : 's'} (index ${index} out of range)`;
	}
	return null;
}

function check_css_name_collisions(
	tokens: unknown[],
	groups: unknown[],
	warnings: ValidationError[]
) {
	const seen = new Map<string, string>();
	const valid_groups = groups
		.filter(is_object)
		.map((g) => ({
			tokens: Array.isArray(g.tokens) ? (g.tokens.filter((n) => typeof n === 'number') as number[]) : [],
			css: is_object(g.css)
				? { prefix: typeof g.css.prefix === 'string' ? g.css.prefix : undefined }
				: undefined
		}));
	tokens.forEach((t, i) => {
		if (!is_object(t)) return;
		if (typeof t.id !== 'number' || typeof t.name !== 'string') return;
		const css_name = token_css_name(
			{
				id: t.id,
				name: t.name,
				css: is_object(t.css) && typeof t.css.name === 'string' ? { name: t.css.name } : undefined
			} as Parameters<typeof token_css_name>[0],
			valid_groups
		);
		const path = `color.tokens[${i}]`;
		const prev = seen.get(css_name);
		if (prev !== undefined) {
			warnings.push({
				path,
				message: `CSS name \`--${css_name}\` collides with ${prev} — one will overwrite the other`
			});
		} else {
			seen.set(css_name, path);
		}
	});
}
