import { generate_css } from '../../src/lib/generate/css.ts';
import { generate_json } from '../../src/lib/generate/json.ts';
import type { Spec } from '../../src/lib/spec.ts';
import { validate } from '../../src/lib/validate.ts';

type Globals = {
	__vs_generate: (spec_str: string) => string;
	__vs_validate: (spec_str: string) => string;
};

const g = globalThis as unknown as Globals;

g.__vs_generate = (spec_str: string) => {
	const spec: Spec = JSON.parse(spec_str);
	return JSON.stringify({
		css: generate_css(spec),
		json: generate_json(spec)
	});
};

g.__vs_validate = (spec_str: string) => {
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
	return JSON.stringify(validate(spec));
};
