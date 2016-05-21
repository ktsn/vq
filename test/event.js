import assert from 'power-assert';

import {element} from '../src/event';

describe('Event helpers:', () => {
  describe('element', () => {
    let input;

    beforeEach(() => {
      input = document.createElement('input');
    });

    it('executes callback if the event is emitted', (done) => {
      const f = element(input, 'input');
      f(() => done())();

      emit(input, 'input');
    });

    it('executes callback only one time', () => {
      const f = element(input, 'input');
      let count = 0;
      f(() => count++)();

      emit(input, 'input');
      emit(input, 'input');
      emit(input, 'input');

      assert(count === 1);
    });

    it('filters events with filter function', () => {
      const f = element(input, 'input', (event) => event.target.value === 'filter');
      let count = 0;
      f(() => count++)();

      emit(input, 'input');
      assert(count === 0);

      input.value = 'filter';
      emit(input, 'input');
      assert(count === 1);
    });
  });
});

function emit(el, name) {
  const event = document.createEvent('UIEvent');
  event.initUIEvent(name, true, true);
  el.dispatchEvent(event);
}
