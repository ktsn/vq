let animate;
if (typeof Velocity === 'function') {
  animate = Velocity;
} else {
  animate = $.Velocity;
}

function stop(el) {
  animate(el, 'stop');
}

export { animate, stop };
