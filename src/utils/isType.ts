/**
 * getTag
 * @private
 * Returns the string notation tag of an object, such as `[object Object]`.
 *
 * @param {*} thing Thing to be checked
 * @return {String} tag for the thing.
 */
function getTag(thing: any): string {
  return Object.prototype.toString.call(thing);
}

/**
 * isArray
 * Whether a thing is an Array
 *
 * @param {*} thing to be checked
 * @return {Boolean} true if thing is an Array
 */
export function isArray(thing: any): boolean {
  return getTag(thing) === "[object Array]";
}

/**
 * isBoolean
 * Check if the item is a Boolean
 *
 * @param {*} thing Item to be checked
 * @return {Boolean} Whether the thing was a boolean
 */
export function isBoolean(thing: any): boolean {
  return typeof thing === "boolean" || (isObject(thing) && getTag(thing) === "[object Boolean]");
}

/**
 * isError
 * Checks if the item is an Error
 *
 * @param {*} thing Item to be checked
 * @return {Boolean} Whether item is an Error.
 */
export function isError(thing: any): boolean {
  if (!isObject(thing)) {
    return false;
  }
  var tag = getTag(thing);
  return (
    tag === "[object Error]" ||
    tag === "[object DOMException]" ||
    (isString(thing["name"]) && isString(thing["message"]))
  );
}

/**
 * isElement
 * Checks if the item is an HTML Element. Because some browsers are not
 * compliant with W3 DOM2 specification, `HTMLElement` may not exist or
 * be defined inconsistently. Instead, we check if the shape of the object
 * is consistent with an Element. This is the same approach used by Lodash.
 *
 * @param {*} thing Item to be checked
 * @return {Boolean} Whether item is an Element.
 */
export function isElement(thing: any): boolean {
  return isObject(thing) && thing["nodeType"] === 1;
}

/**
 * isFunction
 * Whether the provided thing is a Function
 *
 * @param {*} thing Item to be checked
 * @return {Boolean} result
 */
export function isFunction(thing: any): boolean {
  return !!(thing && typeof thing === "function");
}

/**
 * isNumber
 * Whether a thing is an Number
 *
 * @param {*} thing to be checked
 * @return {Boolean} true if thing is an Number
 */
export function isNumber(thing: any): boolean {
  return typeof thing === "number" || (isObject(thing) && getTag(thing) === "[object Number]");
}

/**
 * isObject
 * Checks if the item is an Object
 *
 * @param {*} thing Item to be checked
 * @return {Boolean} Whether item is an object.
 */
export function isObject(thing: any): boolean {
  return !!(thing && typeof thing === "object");
}

/**
 * isString
 * Whether a thing is an String
 *
 * @param {*} thing to be checked
 * @return {Boolean} true if thing is an String
 */
export function isString(thing: any): boolean {
  return typeof thing === "string" || (!isArray(thing) && isObject(thing) && getTag(thing) === "[object String]");
}
