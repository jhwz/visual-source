import type { Attachment } from 'svelte/attachments';

interface AutoscrollerOptions {
	threshold?: number; // Distance from edge to trigger scroll (default: 50px)
	speed?: number; // Scroll speed multiplier (default: 10)
	horizontal?: boolean; // Enable horizontal scrolling (default: true)
	vertical?: boolean; // Enable vertical scrolling (default: true)
}

export function autoscroller(opts: AutoscrollerOptions = {}): Attachment<HTMLElement> {
	const { threshold = 50, speed = 10, horizontal = true, vertical = true } = opts;
	return (el) => {
		let scrollInterval: number | null = null;

		const handleDragOver = (e: DragEvent) => {
			e.preventDefault();

			const rect = el.getBoundingClientRect();
			const x = e.clientX - rect.left;
			const y = e.clientY - rect.top;

			let scrollX = 0;
			let scrollY = 0;

			// Check horizontal bounds
			if (horizontal) {
				if (x < threshold) {
					scrollX = -speed * (1 - x / threshold);
				} else if (x > rect.width - threshold) {
					scrollX = speed * ((x - (rect.width - threshold)) / threshold);
				}
			}

			// Check vertical bounds
			if (vertical) {
				if (y < threshold) {
					scrollY = -speed * (1 - y / threshold);
				} else if (y > rect.height - threshold) {
					scrollY = speed * ((y - (rect.height - threshold)) / threshold);
				}
			}

			// Start/update scrolling
			if (scrollX !== 0 || scrollY !== 0) {
				if (!scrollInterval) {
					scrollInterval = setInterval(() => {
						el.scrollBy(scrollX, scrollY);
					}, 16); // ~60fps
				}
			} else {
				// Stop scrolling
				if (scrollInterval) {
					clearInterval(scrollInterval);
					scrollInterval = null;
				}
			}
		};

		const handleDragLeave = () => {
			if (scrollInterval) {
				clearInterval(scrollInterval);
				scrollInterval = null;
			}
		};

		const handleDrop = () => {
			if (scrollInterval) {
				clearInterval(scrollInterval);
				scrollInterval = null;
			}
		};

		el.addEventListener('dragover', handleDragOver);
		el.addEventListener('dragleave', handleDragLeave);
		el.addEventListener('drop', handleDrop);

		return () => {
			if (scrollInterval) {
				clearInterval(scrollInterval);
			}
			el.removeEventListener('dragover', handleDragOver);
			el.removeEventListener('dragleave', handleDragLeave);
			el.removeEventListener('drop', handleDrop);
		};
	};
}
