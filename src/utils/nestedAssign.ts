/**
 * nestedAssign
 * Assigns the properties from the source objects onto the target. Unlike
 * object.assign, this follows nested objects and assigns the properties from each
 * nested object as well.
 *
 * @param {target} object Target object
 * @param {...sources} object[] Source objects
 * @return {object}
 */
export function nestedAssign(target: object, ...sources: object[]): object {
  for (const source of sources) {
    for (const key of Object.keys(source)) {
      if (typeof source[key] === "object") {
        if (!target[key]) {
          // create an empty target nested object so we don't manipulate the sources
          Object.assign(target, { [key]: {} });
        }
        nestedAssign(target[key], source[key]);
      } else {
        Object.assign(target, { [key]: source[key] });
      }
    }
  }
  return target;
}
