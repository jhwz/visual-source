import type { Spec } from '../spec.js';
import { cleanup_token_overrides } from './shared.js';

/** Delete a spacing token from the scale and drop any theme overrides for it. */
export function delete_token(spec: Spec, id: number): void {
	spec.spacing.scale = spec.spacing.scale.filter((t) => t.id !== id);
	cleanup_token_overrides(spec, 'spacing', id);
}
