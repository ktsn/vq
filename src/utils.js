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

export function noop() {}
