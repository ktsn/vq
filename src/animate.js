let animate;
if (typeof Velocity === 'function') {
  animate = Velocity;
} else {
  animate = $.Velocity;
}

export default animate;
