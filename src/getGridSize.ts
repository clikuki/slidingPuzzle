const min = 3;
const max = 10;
const input = document.querySelector('.sizeInput') as HTMLInputElement;
let size = +input.value;
if (isNaN(size) || size < min || size > max) size = 4;

export function getGridSize() {
	return size;
}

type Listener = (size: number) => void;
const Listeners: Listener[] = [];
export function listen(listener: Listener) {
	Listeners.push(listener);
}

input.addEventListener('change', (e) => {
	const elem = e.target as HTMLInputElement;
	const value = +elem.value;
	if (isNaN(value) || value < min || value > max) return;
	size = value;
	Listeners.forEach((cb) => cb(value));
});
