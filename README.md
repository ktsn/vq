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
var $foo = $('#foo');
var $bar = $('#bar');

/* Animation sequence
----------------------------------------*/
vq.sequence([
  vq($foo, fadeIn),
  function() { console.log('$foo faded in') },
  vq($bar, fadeIn),
  function() { console.log('$bar faded in') },
  vq($bar, fadeOut),
  function(done) {
    setTimeout(function() {
      console.log('You can handle asynchronous processing');
      done();
    }, 1000);
  },
  vq($foo, fadeOut),
  function() { console.log('complete!') }
]);
```

## License
MIT
