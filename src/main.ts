import { Cell } from './cell.js';
import { pxIfy } from './pxIfy.js';
import { cellSize, cellGap, gridPadding } from './constants.js';
import { getGridSize, listen as listenToSizeChange } from './getGridSize.js';

type CellArray = (Cell | null)[];

const grid = document.createElement('div');
grid.classList.add('grid');
grid.style.setProperty('--padding', pxIfy(gridPadding));
grid.style.setProperty(
	'--size',
	pxIfy(getGridSize() * cellSize + (getGridSize() - 1) * cellGap),
);

function countInversions(cells: CellArray) {
	let inversions = 0;
	for (let i = 0; i < cells.length; i++) {
		if (!cells[i]) continue;
		for (let j = i + 1; j < cells.length; j++) {
			if (!cells[j]) continue;
			if (cells[j]!.index < cells[i]!.index) inversions++;
		}
	}
	return inversions;
}

function getIndexRow(index: number) {
	return Math.floor(index / getGridSize());
}

function isSolvable(cells: CellArray) {
	const inversions = countInversions(cells);
	if (getGridSize() % 2) {
		return !Boolean(inversions % 2);
	} else {
		const holeRow = getIndexRow(cells.findIndex((c) => !c));
		return Boolean((inversions + holeRow) % 2);
	}
}

function shuffleCells() {
	while (true) {
		const shuffled = [];
		const copy = cells.slice();
		while (copy.length) {
			shuffled.push(
				...copy.splice(Math.floor(Math.random() * copy.length), 1),
			);
		}
		if (isSolvable(shuffled)) return shuffled;
	}
}

function isBeside(a: number, b: number) {
	if ([a - getGridSize(), a + getGridSize()].includes(b)) return true;
	const aRow = getIndexRow(a);
	if (a - 1 === b && getIndexRow(a - 1) === aRow) return true;
	if (a + 1 === b && getIndexRow(a + 1) === aRow) return true;
}

function addCellListener(cell: Cell, i: number) {
	cell.setPosition(i);
	cell.elem.onclick = () => {
		if (isDoingWinAnimation) return;
		if (isBeside(cell.index, holeIndex)) {
			const prevCellIndex = cell.index;
			const promise = cell.setPosition(holeIndex);
			[cells[holeIndex], cells[cell.index]] = [
				cells[cell.index],
				cells[holeIndex],
			];
			holeIndex = prevCellIndex;
			if (
				!hasWon &&
				cells.every((cell) => cell?.index === cell?.startIndex)
			) {
				isDoingWinAnimation = true;
				hasWon = true;
				promise.then(() => {
					const reverseCells = [...cells].reverse();
					const lastCell = reverseCells.find((cell) => cell);
					cells.forEach((cell) => {
						if (!cell) return;
						setTimeout(
							() =>
								cell.doWinAnim().then(() => {
									if (cell === lastCell)
										isDoingWinAnimation = false;
								}),
							Math.floor(
								cell.index / getGridSize() +
									(cell.index % getGridSize()),
							) * 150,
						);
					});
				});
			}
		}
	};
}

document.querySelector('.restartBtn')!.addEventListener('click', () => {
	if (isDoingWinAnimation) return;
	cells = shuffleCells();
	cells.forEach((cell, i) => {
		if (!cell) return;
		cell.setPosition(i);
	});
	holeIndex = cells.findIndex((c) => !c);
	hasWon = false;
});

let cells: CellArray = new Array(getGridSize() ** 2 - 1)
	.fill(0)
	.map((_, i) => new Cell((i + 1).toString(), i));
cells[cells.length] = null;
cells = shuffleCells();
grid.append(...cells.filter((c) => c).map((c) => c!.elem));
document.querySelector('.tmp')!.replaceWith(grid);
let holeIndex = cells.findIndex((c) => !c);

let isDoingWinAnimation = false;
let hasWon = false;
cells.forEach((cell, i) => {
	if (!cell) return;
	addCellListener(cell, i);
});

listenToSizeChange((size) => {
	grid.style.setProperty(
		'--size',
		pxIfy(size * cellSize + (size - 1) * cellGap),
	);
	cells = new Array(size ** 2 - 1)
		.fill(0)
		.map((_, i) => new Cell((i + 1).toString(), i));
	cells[cells.length] = null;
	cells = shuffleCells();
	grid.replaceChildren(...cells.filter((c) => c).map((c) => c!.elem));
	cells.forEach((cell, i) => {
		if (!cell) return;
		cell.setPosition(i);
	});
	holeIndex = cells.findIndex((c) => !c);
});
