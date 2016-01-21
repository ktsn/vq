import Velocity from 'velocity-animate';

export default function vq(el, props, opts = null) {
  if (!opts) {
    opts = props.o;
    props = props.p;
  }
  opts = clone(opts);

  return function(done) {
    opts.complete = done;
    Velocity(el, props, opts);
  };
}

export function sequence(seq) {
  const head = seq[0];
  const tail = seq.slice(1);

  if (typeof head !== 'function') return;

  if (head.length > 0) {
    // Ensure there is a callback function as 1st argument
    head(function() {
      sequence(tail);
    });
  } else {
    head();
    sequence(tail);
  }
}

function clone(obj) {
  const result = {};

  Object.keys(obj).forEach(function(key) {
    if (obj[key] && typeof obj[key] === 'object') {
      result[key] = clone(obj[key]);
    } else {
      result[key] = obj[key];
    }
  });

  return result;
}
