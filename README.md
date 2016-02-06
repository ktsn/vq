# vq
A light-weight animation helper for Velocity.js

## Dependencies
vq requires [Velocity.js](http://julian.com/research/velocity/). You have to load Velocity.js before using vq.

## Demo
[http://codepen.io/ktsn/pen/KVZeRP](http://codepen.io/ktsn/pen/KVZeRP)

## Example

```js
/* Animation behaviors
----------------------------------------*/
var fadeIn = {
  p: {
    opacity: [1, 0]
  },
  o: {
    duration: 500,
    easing: 'easeOutQuad'
  }
};

var fadeOut = {
  p: {
    opacity: [0, 1]
  },
  o: {
    duration: 500,
    easing: 'easeInQuad'
  }
};

/* Animation elements
----------------------------------------*/
var $foo = $('.foo');
var $bar = $('.bar');

/* Animation sequence
----------------------------------------*/
vq.sequence([
  vq($foo, fadeIn),
  vq($bar, fadeIn).delay(1000).stagger(30),
  vq($bar, fadeOut),
  vq($foo, fadeOut),
  function() { console.log('complete!') }
]);
```

## API
vq provides global function `vq(el, props, opts)` and `vq.sequence(funcs)`.

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

The function receives 1st argument as completion callback. You can handle the animation completion from the callback;

```js
var func = vq(el, props, opts);
func(function() {
  console.log('animation is completed');
});
```

### vq.sequence(funcs)
This function receives the array of functions and executes each function sequentially. If the given function has callback function as 1st argument, vq.sequence waits until the callback is called.

```js
vq.sequence([
  function () { console.log('1'); },
  function (done) {
    setTimeout(function() {
      console.log('2')
      done();
    }, 1000);
  },
  function () { console.log('3'); }
]);
// The output order is 1 -> 2 -> 3
```

The function is useful with using `vq(el, props, opts)`.

```js
vq.sequence([
  vq(el1, animation1),
  vq(el2, animation2),
  vq(el3, animation3),
  function() {
    console.log('Three animations are completed');
  }
]);
```

### vq helper functions
The function returned by `vq(el, props, opts)` has some helper functions. The helpers can modify animation options and behaviors.

The helper function is chainable.

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

## License
MIT
