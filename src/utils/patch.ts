const SYM = Symbol("TrackJS Patch");

/**
 * patch
 * Monkeypatch a method
 *
 * @param {Object} obj The object containing the method.
 * @param {String} name The name of the method
 * @param {Function} func A function to monkeypatch into the method. Will
 *         be called with the original function as the parameter.
 */
export function patch(obj: any, name: string, func: Function): void {
  var original = obj[name] || function() {};
  obj[name] = func(original);
  obj[name][SYM] = original;
}

/**
 * unpatch
 * Remove Monkeypatch from a method. Only works with methods patched using
 * `patch` from *this* instance.
 *
 * @param {Object} obj The object containing the method.
 * @param {String} name The name of the method
 */
export function unpatch(obj: any, name: string): void {
  if (obj[name] && obj[name][SYM]) {
    var original = obj[name][SYM];
    obj[name] = original;
  }
}
