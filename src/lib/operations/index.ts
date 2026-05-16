import type { Spec } from '../spec.js';
import * as palettes_ops from './palettes.js';
import * as spacing_ops from './spacing.js';
import * as themes_ops from './themes.js';
import * as tokens from './tokens.js';

export const color = {
	delete_token: (spec: Spec, id: number) => tokens.delete_token(spec, 'color', id),
	delete_group: (spec: Spec, groupId: number) => tokens.delete_group(spec, 'color', groupId)
};

export const general = {
	delete_token: (spec: Spec, id: number) => tokens.delete_token(spec, 'general', id),
	delete_group: (spec: Spec, groupId: number) => tokens.delete_group(spec, 'general', groupId)
};

export const spacing = spacing_ops;

export const palettes = palettes_ops;

export const themes = themes_ops;

export { cleanup_token_overrides, type TokenSection } from './shared.js';
