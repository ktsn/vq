import chain from './chain';
import {clone} from './utils';

function vq(el, props, opts = null) {
  if (!opts) {
    opts = props.o;
    props = props.p;
  }
  opts = clone(opts);

  return chain(el, props, opts);
}

vq.sequence = function sequence(seq) {
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
};

module.exports = vq;
