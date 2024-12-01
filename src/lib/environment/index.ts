function whats_the_environment() {
	if ('__TAURI_INTERNALS__' in window) {
		return 'tauri';
	}
	return 'browser';
}

export const environment = whats_the_environment();
