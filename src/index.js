import chain from './chain';
import {clone} from './utils';

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
  const head = seq[0];
  const tail = seq.slice(1);

  if (typeof head !== 'function') return;

  if (head.length > 0) {
    // Ensure there is a callback function as 1st argument
    return head(function() {
      sequence(tail);
    });
  }

  const res = head();

  // Wait until the head function is terminated if the returned value is thenable
  if (res && typeof res.then === 'function') {
    return res.then(() => sequence(tail));
  }

  return sequence(tail);
};

module.exports = vq;
