import spy from './velocity-spy';
import assert from 'power-assert';
import {Promise} from 'es6-promise';
import vq from '../src/index';

describe('Index:', () => {
  let el;

  beforeEach(() => {
    el = document.createElement('div');
  });

  describe('vq function', () => {
    const props = { width: 300, opacity: [1, 0] };
    const opts = { duration: 200, easing: 'easeOutQuad' };
    const prog = function() {};

    it('returns function object', () => {
      assert(typeof vq(el, {}, {}) === 'function');
    });

    it('through parameters to the Velocity function', () => {
      const result = spy();

      vq(el, props, opts)();

      const args = result.args;
      assert(args[0] === el);
      Object.keys(props).forEach((key) => assert(args[1][key] === props[key]));
      Object.keys(opts).forEach((key) => assert(args[2][key] === opts[key]));
    });

    it('accepts single object format', () => {
      const result = spy();

      vq(el, { p: props, o: opts })();

      const args = result.args;
      assert(args[0] === el);
      Object.keys(props).forEach((key) => assert(args[1][key] === props[key]));
      Object.keys(opts).forEach((key) => assert(args[2][key] === opts[key]));
    });

    it('accepts progress function', () => {
      const result = spy();

      vq(el, prog, opts)();

      // should set tween value to [1, 0]
      assert(result.args[1].tween[0] === 1);
      assert(result.args[1].tween[1] === 0);

      assert(result.args[2].progress === prog);
    });

    it('accepts progress function as single object format', () => {
      const result = spy();

      vq(el, { p: prog, o: opts })();

      // should set tween value to [1, 0]
      assert(result.args[1].tween[0] === 1);
      assert(result.args[1].tween[1] === 0);

      assert(result.args[2].progress === prog);
    });

    it('throws an error if the arg length is less than two', () => {
      const message = /Must have two or three args/;

      assert.throws(() => {
        vq();
      }, message);

      assert.throws(() => {
        vq(el);
      }, message);
    });

    it('throws an error if it receives two args and the 2nd arg is not single object format', () => {
      assert.throws(() => {
        vq(el, props);
      }, /2nd arg must have `p` and `o` property when only two args is given/);
    });

    it('receives callback function to notify completion', () => {
      const fn = function() {};
      const result = spy();

      vq(el, props, opts)(fn);

      assert(result.args[2].complete === fn);
    });
  });

  describe('vq.sequence function', () => {

    it('executes the given functions sequentially', (done) => {
      const res = [];

      vq.sequence([
        () => res.push(1),
        () => res.push(2),
        () => res.push(3),
        () => {
          assert.deepEqual(res, [1, 2, 3]);
          done();
        }
      ]);
    });

    it('handles asyncronous functions by callbacks', (done) => {
      const res = [];

      vq.sequence([
        (done) => {
          setTimeout(() => {
            res.push(1);
            done();
          }, 1);
        },
        () => res.push(2),
        () => {
          assert.deepEqual(res, [1, 2]);
          done();
        }
      ]);
    });

    it('handles asyncronous functions by promises', (done) => {
      const res = [];

      vq.sequence([
        () => new Promise((resolve) => {
          setTimeout(() => {
            res.push(1);
            resolve();
          }, 1);
        }),
        () => res.push(2),
        () => {
          assert.deepEqual(res, [1, 2]);
          done();
        }
      ]);
    });

  });
});
