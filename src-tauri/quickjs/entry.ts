import { generate_css } from '../../src/lib/generate/css.ts';
import { generate_json } from '../../src/lib/generate/json.ts';
import type { Spec } from '../../src/lib/spec.ts';
import { validate as validate_spec } from '../../src/lib/validate.ts';

export function generate(spec_str: string): string {
	const spec: Spec = JSON.parse(spec_str);
	return JSON.stringify({
		css: generate_css(spec),
		json: generate_json(spec)
	});
}

export function validate(spec_str: string): string {
	let spec: unknown;
	try {
		spec = JSON.parse(spec_str);
	} catch (e) {
		return JSON.stringify({
			errors: [
				{
					path: '',
					message: `manifest.json is not valid JSON: ${(e as Error).message}`
				}
			],
			warnings: []
		});
	}
	return JSON.stringify(validate_spec(spec));
}
