import interact from 'interactjs';
import EternityFunction from './Eternity';

const canvasEl = document.querySelector('.canvas');
const ctx = canvasEl.getContext('2d');

const state = {
  view: {
    x: 500,
    y: 500,
    scale: -0.0975,
  },
  settings: {
    scaleSpeed: () => 10000, // less - faster
    dimension: () => 5,
  },
  mouse: {
    x: 0,
    y: 0,
  }
};

// utils --->
const iterate = (num, fn) => Array(num).fill().map((v, i) => fn(i));
// <---

// DRAW WORLD --->
const drawPixel = (x, y, color) => {
  ctx.fillStyle = `rgb(${color}, ${color}, ${color})`;
  ctx.fillRect(x, y, 1, 1);
};

const drawWorld = (time, _EternityFunction) => {
  const { width, height } = ctx.canvas;
  iterate(width * height, (i) => { // <--- iterate by canvas

    const x = i % width;
    const y = Math.floor(i / width);

    const etX = x / state.view.scale - state.view.x / state.settings.dimension();
    const etY = y / state.view.scale - state.view.y / state.settings.dimension();

    const value = _EternityFunction(etX, etY, time);
    drawPixel(x, y, value);
  });
};
// <---

// Fit CANVAS to window --->
const fitCanvasToWindow = () => {
  ctx.canvas.width = window.innerWidth / state.settings.dimension();
  ctx.canvas.height = window.innerHeight / state.settings.dimension();
  canvasEl.style.width = `${window.innerWidth}px`;
  canvasEl.style.height = `${window.innerHeight}px`;
};
window.addEventListener('resize', fitCanvasToWindow);
fitCanvasToWindow();
// <---

// Scale control --->
window.addEventListener("wheel", (event) => {
  const scaleDelta = event.deltaY / state.settings.scaleSpeed();
  const newScale = state.view.scale + scaleDelta;
  const newWidth = ctx.canvas.width / newScale;
  const newHeight = ctx.canvas.height / newScale;
  const oldWidth = ctx.canvas.width / state.view.scale;
  const oldHeight = ctx.canvas.height / state.view.scale;
  const adaptiveMouseX = state.mouse.x / state.settings.dimension() / state.view.scale;
  const adaptiveMouseY = state.mouse.y / state.settings.dimension() / state.view.scale;
  const mousePercentX = (adaptiveMouseX - oldWidth / 2) / (oldWidth / 2);
  const mousePercentY = (adaptiveMouseY - oldHeight / 2) / (oldHeight / 2);
  const widthDiff = (oldWidth - newWidth) + (oldWidth - newWidth) * mousePercentX;
  const heightDiff = (oldHeight - newHeight) + (oldHeight - newHeight) * mousePercentY;
  state.view.x -= widthDiff / 2 * state.settings.dimension();
  state.view.y -= heightDiff / 2 * state.settings.dimension();
  state.view.scale = newScale;
  event.preventDefault();
})
// <---

// Mouse POSITION handling --->
window.addEventListener('mousemove', (event) => {
  state.mouse.x = event.pageX;
  state.mouse.y = event.pageY;
});
// <---

// Init canvas DRAG --->
const draggableSettings = {
  onmove: (event) => {
    state.view.x += event.dx / state.view.scale;
    state.view.y += event.dy / state.view.scale;
  }
};
interact('#canvas').draggable(draggableSettings).styleCursor(false);
// <---

// start TIME
const timeTick = (time) => {
  drawWorld(time, EternityFunction);
  requestAnimationFrame(() => timeTick(time + 1));
};
timeTick(0);
//

