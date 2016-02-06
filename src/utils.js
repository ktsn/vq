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
