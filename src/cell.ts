import { cellSize, cellGap, gridPadding, gridSize } from './constants.js';
import { pxIfy } from './pxIfy.js';
export class Cell {
	elem = document.createElement('div');
	startIndex: number;
	index: number;
	constructor(text: string, index = 0) {
		this.startIndex = index;
		this.index = index;
		this.elem.textContent = text;
		this.elem.classList.add('cell');
		this.elem.style.setProperty('--size', pxIfy(cellSize));
		this.setPosition(index);
	}
	setPosition(index: number) {
		this.index = index;
		const x = index % gridSize;
		const y = Math.floor(index / gridSize);
		this.elem.style.left = pxIfy(x * cellSize + x * cellGap + gridPadding);
		this.elem.style.top = pxIfy(y * cellSize + y * cellGap + gridPadding);
		return new Promise<void>((resolve) => {
			this.elem.addEventListener('transitionend', () => resolve(), {
				once: true,
			});
		});
	}
	doWinAnim() {
		this.elem.classList.add('winAnim');
		return new Promise<void>((resolve) => {
			this.elem.addEventListener(
				'animationend',
				() => {
					this.elem.classList.remove('winAnim');
					resolve();
				},
				{ once: true },
			);
		});
	}
}
