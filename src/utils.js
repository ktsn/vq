/**
 * Unify the given function to callback contination style
 */
export function unify(fn) {
  return function(done) {
    if (typeof fn !== 'function') return done();

    if (fn.length > 0) {
      // Ensure there is a callback function as 1st argument
      return fn(done);
    }

    const res = fn();

    // Wait until the function is terminated if the returned value is thenable
    if (res && typeof res.then === 'function') {
      return res.then(done);
    }

    // Just `done` if no asynchronous continuation method is given
    return done();
  };
}

export function clone(obj, deep = false) {
  const result = {};

  Object.keys(obj).forEach(function(key) {
    if (deep && obj[key] && typeof obj[key] === 'object') {
      result[key] = clone(obj[key]);
    } else {
      result[key] = obj[key];
    }
  });

  return result;
}

export function assign(target, ...sources) {
  sources.forEach(function(source) {
    Object.keys(source).forEach(function(key) {
      target[key] = source[key];
    });
  });

  return target;
}

export function on(el, name, f) {
  el.addEventListener(name, f);
}

export function off(el, name, f) {
  el.removeEventListener(name, f);
}

export function noop() {}
