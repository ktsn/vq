import animate from './animate';
import {assign} from './utils';

const helpers = {
  delay(msec) {
    this._opts.delay = msec;
    return this;
  },

  progress(fn, tween = null) {
    this._props.tween = tween || this._props.tween || [1, 0];
    this._opts.progress = fn;
    return this;
  }
};

export default function chain(el, props, opts) {
  const fn = function fn(done) {
    fn._opts.complete = done;
    animate(fn._el, fn._props, fn._opts);
  };
  fn._el = el;
  fn._props = props;
  fn._opts = opts;

  assign(fn, helpers);

  return fn;
}
