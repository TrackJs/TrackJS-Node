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
  var original = obj[name] || function() {}
  obj[name] = func(original)
}
