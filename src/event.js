import {unify, on, off, noop} from './utils';

/**
 * Helper function to create event helpers
 * The function should not be exposed
 */
function create(f) {
  return behavior => done => {
    if (typeof done !== 'function') done = noop;
    f(unify(behavior), done);
  };
}

export function element(el, name, filter = noFilter) {
  return create((behavior, done) => {
    function go(event) {
      if (!filter(event)) return;

      off(el, name, go);
      behavior(done);
    }

    on(el, name, go);
  });
}

export function delay(msec) {
  return create((behavior, done) => {
    setTimeout(() => behavior(done), msec);
  });
}

function noFilter() { return true; }

/**
 * Convenient helpers for DOM events
 */

export function click(el) {
  return element(el, 'click');
}

export function dblclick(el) {
  return element(el, 'dblclick');
}

export function mousedown(el) {
  return element(el, 'mousedown');
}

export function mouseup(el) {
  return element(el, 'mouseup');
}

export function mousemove(el) {
  return element(el, 'mousemove');
}

export function mouseenter(el) {
  return element(el, 'mouseenter');
}

export function mouseleave(el) {
  return element(el, 'mouseleave');
}

export function focus(el) {
  return element(el, 'focus');
}

export function blur(el) {
  return element(el, 'blur');
}

export function change(el) {
  return element(el, 'change');
}

export function input(el) {
  return element(el, 'input');
}

export function scroll(el) {
  return element(el, 'scroll');
}

export function load(el) {
  return element(el, 'load');
}
