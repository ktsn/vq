import animate from './animate';
import {assign} from './utils';

const helpers = {
  delay(msec) {
    this._opts.delay = msec;
    return this;
  },

  duration(msec) {
    this._opts.duration = msec;
    return this;
  },

  easing(name) {
    this._opts.easing = name;
    return this;
  },

  progress(fn, tween = null) {
    this._props.tween = tween || this._props.tween || [1, 0];
    this._opts.progress = fn;
    return this;
  },

  display(value) {
    this._opts.display = value;
    return this;
  },

  visibility(value) {
    this._opts.visibility = value;
    return this;
  },

  loop(count) {
    this._opts.loop = count;
    return this;
  },

  stagger(msec) {
    this._opts.stagger = msec;
    return this;
  }
};

function run(el, props, opts, done) {
  if (typeof opts.stagger === 'number') {
    staggerImpl(el, props, opts, done);
  } else {
    opts.complete = done;
    animate(el, props, opts);
  }
}

function staggerImpl(els, props, opts, done) {
  const interval = opts.stagger;
  let i = 0;
  const len = els.length;

  const animateWrapper = function animateWrapper() {
    // Set complete callback to last animation
    if (i === len - 1) {
      opts.complete = done;
    }

    const el = els[i];
    animate(el, props, opts);

    ++i;
    if (i < len) {
      setTimeout(animateWrapper, interval);
    }
  };

  animateWrapper();
}

export default function chain(el, props, opts) {
  const fn = function fn(done) {
    run(el, props, opts, done);
  };
  fn._el = el;
  fn._props = props;
  fn._opts = opts;

  assign(fn, helpers);

  return fn;
}
