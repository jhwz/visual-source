import type { Action } from 'svelte/action';

export function reorderable(
	cb: (opts: { from: number; to: number }) => void
): Action<HTMLElement, number> {
	return (node, index: number) => {
		node.draggable = true;

		function dragstart(e: DragEvent) {
			e.dataTransfer!.dropEffect = 'move';
			e.dataTransfer!.setData('text/plain', index.toString());
		}
		function dragover(e: DragEvent) {
			e.preventDefault();
			e.dataTransfer!.dropEffect = 'move';
		}
		function drop(e: DragEvent) {
			e.preventDefault();
			const from = parseInt(e.dataTransfer!.getData('text/plain'));
			cb({ from, to: index });
		}

		node.addEventListener('dragstart', dragstart);
		node.addEventListener('dragover', dragover);
		node.addEventListener('drop', drop);
		return {
			destroy() {
				node.removeEventListener('dragstart', dragstart);
				node.removeEventListener('dragover', dragover);
				node.removeEventListener('drop', drop);
			}
		};
	};
}
