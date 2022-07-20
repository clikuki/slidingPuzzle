import { cellSize, cellGap, gridPadding } from './constants.js';
import { getGridSize } from './getGridSize.js';
import { pxIfy } from './pxIfy.js';
export class Cell {
    constructor(text, index = 0) {
        this.elem = document.createElement('div');
        this.startIndex = index;
        this.index = index;
        this.elem.textContent = text;
        this.elem.classList.add('cell');
        this.elem.style.setProperty('--size', pxIfy(cellSize));
        this.setPosition(index);
    }
    setPosition(index) {
        this.index = index;
        const gridSize = getGridSize();
        const x = index % gridSize;
        const y = Math.floor(index / gridSize);
        this.elem.style.left = pxIfy(x * cellSize + x * cellGap + gridPadding);
        this.elem.style.top = pxIfy(y * cellSize + y * cellGap + gridPadding);
        return new Promise((resolve) => {
            this.elem.addEventListener('transitionend', () => resolve(), {
                once: true,
            });
        });
    }
    doWinAnim() {
        this.elem.classList.add('winAnim');
        return new Promise((resolve) => {
            this.elem.addEventListener('animationend', () => {
                this.elem.classList.remove('winAnim');
                resolve();
            }, { once: true });
        });
    }
}
//# sourceMappingURL=cell.js.map