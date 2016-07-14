# vq

[![npm version](https://badge.fury.io/js/vq.svg)](https://badge.fury.io/js/vq)
[![Build Status](https://travis-ci.org/ktsn/vq.svg?branch=master)](https://travis-ci.org/ktsn/vq)

A light-weight and functional animation helper for Velocity.js

## Dependencies
vq requires [Velocity.js](http://julian.com/research/velocity/). You have to load Velocity.js before using vq.

## Installation

```sh
$ npm install vq
```

or download from [release page](https://github.com/ktsn/vq/releases).

## Demo
- [Sequencial Animation](http://codepen.io/ktsn/pen/KVZeRP)
- [Event Handling](http://codepen.io/ktsn/pen/qZzzqX)

## Example

```js
/* Animation behaviors
----------------------------------------*/
var fadeIn = {
  p: { opacity: [1, 0] },
  o: { duration: 500, easing: 'easeOutQuad' }
};

var fadeOut = {
  p: { opacity: [0, 1] },
  o: { duration: 500, easing: 'easeInQuad' }
};

/* Animation elements
----------------------------------------*/
var $foo = $('.foo');
var $bar = $('.bar');

/* Animation sequence
----------------------------------------*/
var seq = vq.sequence([
  vq($foo, fadeIn),
  vq($bar, fadeIn).delay(1000).stagger(30),
  vq($bar, fadeOut),
  vq($foo, fadeOut),
  function() { console.log('complete!') }
]);

seq();
```

## API
vq provides global function `vq(el, props, opts)`, `vq.sequence(funcs)` and `vq.parallel(funcs)`.

### vq(el, props, opts)
This function returns a function that executes animation by given element, property and options.

```js
var el = document.getElementById('element');
var func = vq(el, { width: 400 }, { duration: 600 }); // generate a function
func(); // <-- The animation is executed on this time
```

You can combine the `props` and `opts` to [Velocity-like single object](http://julian.com/research/velocity/#arguments).

```js
var fadeIn = {
  p: {
    opacity: [1, 0]
  },
  o: {
    duration: 500
  }
};

var func = vq(el, fadeIn);
func();
```

You can pass a Velocity's progress callback to the 2nd argument or the value of `p`.

```js
var swing = {
  p: function(el, t, r, t0, tween) {
    var offset = 100 * Math.sin(2 * tween * Math.PI);
    el[0].style.transform = 'translate3d(' + offset + 'px, 0, 0)';
  },
  o: {
    duration: 1000,
    easing: 'easeOutCubic'
  }
}

var func = vq(el, swing);
func();
```

The function receives 1st argument as completion callback. You can handle the animation completion from the callback;

```js
var func = vq(el, props, opts);
func(function() {
  console.log('animation is completed');
});
```

### vq.sequence(funcs)
This function receives the array of functions and returns a function to execute them sequentially. If the given function returns Promise object or has callback function as 1st argument, vq.sequence waits until the asynchronous processes are finished.

```js
var seq = vq.sequence([
  function(done) {
    setTimeout(function() {
      console.log('1')
      done();
    }, 1000);
  },
  function() {
    return new Promise(function(resolve, reject) {
      setTimeout(function() {
        console.log('2');
        resolve();
      }, 500);
    });
  },
  function() { console.log('3'); }
]);

seq();
// The output order is 1 -> 2 -> 3
```

The function is useful with using `vq(el, props, opts)`.

```js
var animSeq = vq.sequence([
  vq(el1, animation1),
  vq(el2, animation2),
  vq(el3, animation3),
  function() {
    console.log('Three animations are completed');
  }
]);
```

### vq.parallel(funcs)
This function is same as `vq.sequence` except to execute in parallel.

```js
var para = vq.parallel([
  function(done) {
    setTimeout(function() {
      console.log('1')
      done();
    }, 1000);
  },
  function() {
    return new Promise(function(resolve, reject) {
      setTimeout(function() {
        console.log('2');
        resolve();
      }, 500);
    });
  },
  function() { console.log('3'); }
]);

para();
// The output order may be 3 -> 2 -> 1
```

### vq.stop(els)
This function creates *animation stopper* for given elements.
If you execute returned function, all animated elements is stopped.

```js
var stopFn = vq.stop([el1, el2, el3]);

var seq = vq.sequence([
  vq(el1, animation1),
  vq(el2, animation2),
  vq(el3, animation3)
])();

setTimeout(stopFn, 3000); // stop `seq` animations after 3000msec
```

### Event helpers

#### DOM Event helpers
vq can handle DOM events by event helpers and execute some animation after receiving the events.  
vq has following event helpers.

- click
- dblclick
- mousedown
- mouseup
- mousemove
- mouseenter
- mouseleave
- focus
- blur
- change
- input
- scroll
- load

The helper functions expect a DOM element for the argument and returns a new function.
The returned function expect an animation function that you will get from `vq`, `vq.sequence` or `vq.parallel` functions.

```js
var click = vq.click(window);

var fade = vq.sequence([
  click(vq(el, fadeIn)),
  click(vq(el, fadeOut)),
  function(done) { fade(done); }
]);

fade();
```

You can create a new event helper by using `vq.element` function.
`vq.element` receives an element, a DOM event name and an optional filter function.
If you specify the filter function, your event helper does not execute an animation function until the filter function returns `true`.

```js
var helloWorld = vq.element(input, 'input', function(event) {
  return event.target.value === 'Hello World';
});

var seq = vq.sequence([
  helloWorld(vq(input, fadeOut)),
  // some other animations
]);

seq();
```

#### Delay Helper

`vq.delay(msec)` returns the function that delays given callback for `msec`.
This function can use for not only animation function but also normal functions.

```js
var delay1s = vq.delay(1000);

var delayedFn = delay1s(function() {
  console.log('This message is delayed 1sec');
});

delayedFn();
```

### vq chainable helper methods
The function returned by `vq(el, props, opts)` has some chainable helper methods. The helpers can modify animation options and behaviors.

```js
vq.sequence([
  vq(el1, animation1),
  vq(el2, animation2).delay(100).loop(3), // Add 100ms delay and three times loop
  vq(el3, animation3)
]);
```

#### .delay(msec)
Set the delay of animation start to `msec`.

#### .duration(msec)
Set the duration of animation to `msec`.

#### .easing(name)
Set the easing of animation to `name`. `name` should be easing function name that allowed on Velocity.js.

#### .progress(func, tween)
Set the progress function to `func`.

`tween` is optional argument and it is set to `props.tween`. `[1, 0]` is set if `tween` is omitted and `props.tween` is not set previously.

See [Velocity.js documentation](http://julian.com/research/velocity/#progress) to learn tween property.

#### .display(value)
Set the display option to `value`.

#### .visibility(value)
Set the visibility option to `value`.

#### .loop(count)
Set the loop option to `count`.

#### .stagger(msec)
Set the delay between each element animation to `msec`.

## Contribution
Contribution is welcome! Feel free to open an issue or a pull request.

## License
MIT
