import chain from './chain';
import {unify, clone, noop} from './utils';
import {stop as _stop} from './animate';

export function vq(el, props, opts = null) {
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

export function sequence(seq) {
  return function(done) {
    // Do not use ES default parameters because the babel eliminates actual arguments.
    // Then we cannot detect whether the callback is set or not.
    if (typeof done !== 'function') done = noop;

    sequenceImpl(seq, done);
  };
}

export function parallel(fns) {
  let waiting = fns.length;

  return function(done) {
    // Do not use ES default parameters because the babel eliminates actual arguments.
    // Then we cannot detect whether the callback is set or not.
    if (typeof done !== 'function') done = noop;

    const listener = function listener() {
      --waiting;
      if (waiting === 0) done();
    };

    fns.map(unify).forEach(fn => fn(listener));
  };
}

export function stop(els) {
  return function(done) {
    if (typeof done !== 'function') done = noop;

    els.forEach(_stop);
    done();
  };
}

function sequenceImpl(seq, done) {
  if (seq.length === 0) return done();

  const head = unify(seq[0]);
  const tail = seq.slice(1);

  return head(() => sequenceImpl(tail, done));
}
