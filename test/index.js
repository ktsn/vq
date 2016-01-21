import assert from 'power-assert';
import index from '../src/index';

describe('Index', () => {
  it('should provide module', () => {
    assert.deepEqual(index, {});
  });
});
