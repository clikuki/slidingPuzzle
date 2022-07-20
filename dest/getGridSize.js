const min = 3;
const max = 10;
const input = document.querySelector('.sizeInput');
let size = +input.value;
if (isNaN(size) || size < min || size > max)
    size = 4;
export function getGridSize() {
    return size;
}
const Listeners = [];
export function listen(listener) {
    Listeners.push(listener);
}
input.addEventListener('change', (e) => {
    const elem = e.target;
    const value = +elem.value;
    if (isNaN(value) || value < min || value > max)
        return;
    size = value;
    Listeners.forEach((cb) => cb(value));
});
//# sourceMappingURL=getGridSize.js.map