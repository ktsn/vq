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

  head(function() {
    sequence(tail);
  });
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
