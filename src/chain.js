import animate from './animate';
import {assign} from './utils';

const helpers = {
  delay(msec) {
    this._opts.delay = msec;
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
