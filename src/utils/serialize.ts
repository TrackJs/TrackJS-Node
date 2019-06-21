import * as isType from './isType';

function serializeElement(el) {
  var htmlTagResult = '<' + el.tagName.toLowerCase();
  var attributes = el['attributes'] || [];
  for (var idx = 0; idx < attributes.length; idx++) {
    htmlTagResult += ' ' + attributes[idx].name + '="' + attributes[idx].value + '"';
  }
  return htmlTagResult + '>';
}

/**
  * serialize
  * Default serializer function that takes an arbitrary value and converts
  * it to a string representation.
  *
  * @param {*} thing Thing to serialize
  * @return {String} serialized version of thing.
  */
export default function serialize(thing: any): string {
  if (thing === '') { return 'Empty String'; }
  if (thing === undefined) { return 'undefined'; }
  if (isType.isString(thing) || isType.isNumber(thing) || isType.isBoolean(thing) || isType.isFunction(thing)) {
    return '' + thing;
  }
  if (isType.isElement(thing)) {
    return serializeElement(thing);
  }
  if (typeof thing === 'symbol') {
    return Symbol.prototype.toString.call(thing);
  }

  var result;
  try {
    result = JSON.stringify(thing, function(key, value) {
      if (value === undefined) { return 'undefined'; }
      if (isType.isNumber(value) && isNaN(value)) { return 'NaN'; }
      // NOTE [Todd Gardner] Errors do not serialize automatically do to some
      //      trickery on where the normal properties reside. So let's convert
      //      it into an object that can be serialized.
      if (isType.isError(value)) {
        return {
          'name': value['name'],
          'message': value['message'],
          'stack': value['stack']
        };
      }
      if (isType.isElement(value)) {
        return serializeElement(value);
      }
      return value;
    });
  }
  catch (e) {
    // NOTE [Todd Gardner] There were circular references inside of the thing
    //      so let's fallback to a simpler serialization, just the top-level
    //      keys on the thing, using only string coercion.
    var unserializableResult = '';
    for (var key in thing) {
      if (!thing.hasOwnProperty(key)) { continue; }
      unserializableResult += ',"' + key + '":"' + thing[key] + '"';
    }
    result = unserializableResult ?
      '{' + unserializableResult.replace(',', '') + '}' :
      'Unserializable Object';
  }

  // NOTE [Todd Gardner] in order to correctly capture undefined and NaN,
  //      we wrote them out as strings. But they are not strings, so let's
  //      remove the quotes.
  return result
    .replace(/"undefined"/g, 'undefined')
    .replace(/"NaN"/g, 'NaN');
}
