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

      const args = result[0].args;
      assert(args[0] === el);
      Object.keys(props).forEach((key) => assert(args[1][key] === props[key]));
      Object.keys(opts).forEach((key) => assert(args[2][key] === opts[key]));
    });

    it('accepts single object format', () => {
      const result = spy();

      vq(el, { p: props, o: opts })();

      const args = result[0].args;
      assert(args[0] === el);
      Object.keys(props).forEach((key) => assert(args[1][key] === props[key]));
      Object.keys(opts).forEach((key) => assert(args[2][key] === opts[key]));
    });

    it('accepts progress function', () => {
      const result = spy();

      vq(el, prog, opts)();

      // should set tween value to [1, 0]
      assert(result[0].args[1].tween[0] === 1);
      assert(result[0].args[1].tween[1] === 0);

      assert(result[0].args[2].progress === prog);
    });

    it('accepts progress function as single object format', () => {
      const result = spy();

      vq(el, { p: prog, o: opts })();

      // should set tween value to [1, 0]
      assert(result[0].args[1].tween[0] === 1);
      assert(result[0].args[1].tween[1] === 0);

      assert(result[0].args[2].progress === prog);
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

      assert(result[0].args[2].complete === fn);
    });
  });

  describe('vq.sequence function', () => {

    it('returns thunk function', () => {
      assert(typeof vq.sequence([]) === 'function');
    });

    it('should call the callback after the all functions are finished', (done) => {
      let res = 0;

      vq.sequence([
        () => res += 1,
        () => res += 2,
        () => res += 3,
        () => assert(res === 6)
      ])(done);
    });

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
      ])();
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
      ])();
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
      ])();
    });

    it('ignores non-function objects', () => {
      const res = [];

      vq.sequence([
        () => res.push(1),
        null,
        () => res.push(2),
        'this string will be ignored',
        () => res.push(3),
        12345,
        () => res.push(4),
        undefined,
        () => res.push(5)
      ])();

      assert.deepEqual(res, [1, 2, 3, 4, 5]);
    });

    it('ignores non-function objects even if edge case', () => {
      let res = false;

      vq.sequence([
        null,
        () => res = true,
        undefined
      ])();

      assert(res);
    });

    it('does nothing if no callback is given', () => {
      assert.doesNotThrow(() => {
        vq.sequence([
          () => {}
        ])();
      });
    });
  });

  describe('vq.parallel function', () => {
    it('returns thunk function', () => {
      assert(typeof vq.parallel([]) === 'function');
    });

    it('calls given functions in parallel', () => {
      /* eslint no-unused-vars: 0 */
      let sum = 0;

      vq.parallel([
        (done) => { sum += 1; },
        () => new Promise(() => { sum += 2; }),
        () => sum += 3
      ])();

      assert(sum === 6);
    });

    it('should call the callback after all functions are finished', (done) => {
      let sum = 0;

      vq.parallel([
        (done) => {
          setTimeout(() => {
            sum += 2;
            assert(sum === 3);
            done();
          }, 5);
        },

        () => new Promise((resolve) => {
          setTimeout(() => {
            sum += 3;
            assert(sum === 6);
            resolve();
          }, 10);
        }),

        () => {
          sum += 1;
          assert(sum === 1);
        }
      ])(done);
    });

    it('does nothing if no callback is given', () => {
      assert.doesNotThrow(() => {
        vq.parallel([
          () => {}
        ])();
      });
    });
  });

  describe('vq.stop function', () => {
    it('returns thunk function', () => {
      const el = document.createElement('div');
      assert(typeof vq.stop([el]) === 'function');
    });

    it('emits stop request for all elements', () => {
      const result = spy();

      const els = [
        document.createElement('div'),
        document.createElement('p'),
        document.createElement('span')
      ];

      vq.stop(els)();

      result.forEach(({ args }, i) => {
        assert.deepEqual(args, [els[i], 'stop']);
      });
    });

    it('call callback function after stopping elements', (done) => {
      vq.stop([document.createElement('div')])(done);
    });
  });
});
