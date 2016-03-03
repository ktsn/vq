import chain from './chain';
import {clone, noop} from './utils';

function vq(el, props, opts = null) {
  if (!el || !props) throw new Error('Must have two or three args');

  if (!opts) {
    if (!('p' in props && 'o' in props)) {
      throw new Error('2nd arg must have `p` and `o` property when only two args is given');
    }

    opts = props.o;
    props = props.p;
  }

  // use `props` as progress callback if it is a function
  if (typeof props === 'function') {
    opts.progress = props;
    props = {
      tween: [1, 0]
    };
  }

  // Avoid changing original props and opts
  // vq may mutate these values internally
  props = clone(props);
  opts = clone(opts);

  return chain(el, props, opts);
}

vq.sequence = function sequence(seq) {
  return function(done) {
    // Do not use ES default parameters because the babel eliminates actual arguments.
    // Then we cannot detect whether the callback is set or not.
    if (typeof done !== 'function') done = noop;

    sequenceImpl(seq, done);
  };
};

vq.parallel = function parallel(fns) {
  let waiting = fns.length;

  return function(done) {
    // Do not use ES default parameters because the babel eliminates actual arguments.
    // Then we cannot detect whether the callback is set or not.
    if (typeof done !== 'function') done = noop;

    const listener = function listener() {
      --waiting;
      if (waiting === 0) done();
    };

    for (const fn of fns) {
      unify(fn)(listener);
    }
  };
};

function sequenceImpl(seq, done) {
  if (seq.length === 0) return done();

  const head = unify(seq[0]);
  const tail = seq.slice(1);

  return head(() => sequenceImpl(tail, done));
}

function unify(fn) {
  return function(done) {
    if (typeof fn !== 'function') return done();

    if (fn.length > 0) {
      // Ensure there is a callback function as 1st argument
      return fn(done);
    }

    const res = fn();

    // Wait until the function is terminated if the returned value is thenable
    if (res && typeof res.then === 'function') {
      return res.then(done);
    }

    return done();
  };
}

module.exports = vq;
