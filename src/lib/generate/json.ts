import { resolved_spec, type Spec } from '$lib/spec.js';

export function generate_json(spec: Spec) {
	const base = resolved_spec(spec);

	const themes: Record<
		string,
		{
			color: { tokens: any[] };
			spacing: { scale: any[] };
			general: { tokens: any[] };
		}
	> = {};
	for (const theme of spec.themes || []) {
		const resolved = resolved_spec(spec, theme);
		themes[theme.name] = {
			color: { tokens: resolved.color.tokens },
			spacing: { scale: resolved.spacing.scale },
			general: { tokens: resolved.general.tokens }
		};
	}

	return JSON.stringify({ ...base, themes });
}
