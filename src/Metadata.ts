import { serialize } from "./utils/serialize";
import { isString } from "./utils/isType";

interface dictionary {
  [key: string]: string;
}

/**
 * User-defined Metadata about the current environment.
 */
export class Metadata {
  private _hash: dictionary = {};

  constructor(initialMeta?: dictionary) {
    if (initialMeta) {
      this.add(initialMeta);
    }
  }

  /**
   * Add a key-value pair of strings to metadata.
   * Or add a Dictionary Object of key-value pairs to metadata.
   *
   * @param meta {String|Dictionary} key to add, or Dictionary Object.
   * @param value {String} value to add.
   * @example
   *   metadata.add('foo', 'bar')
   *   metadata.add({ 'foo': 'bar', 'bar': 'baz' })
   */
  add(meta: string | dictionary, value?: string): void {
    if (isString(meta)) {
      this._hash[meta as string] = value;
    } else {
      Object.keys(meta).forEach((key) => {
        this._hash[serialize(key)] = serialize(meta[key]);
      });
    }
  }

  /**
   * Creates a copy of the metadata.
   */
  clone(): Metadata {
    let cloned = new Metadata();
    cloned.add(
      this.get().reduce((pre, cur) => {
        pre[cur.key] = cur.value;
        return pre;
      }, {})
    );
    return cloned;
  }

  /**
   * Returns the contents of metadata as an Array of Objects.
   */
  get(): Array<{ key: string; value: string }> {
    return Object.keys(this._hash).map((key) => {
      return { key, value: this._hash[key] };
    });
  }

  /**
   * Remove a key from metadata.
   * Or remove a Dictionary Object of keys from metadata. The values in the
   * dictionary do not matter.
   *
   * @param meta {String|Dictionary} key to add, or Dictionary Object.
   * @example
   *   metadata.remove('foo')
   *   metadata.remove({ 'foo': '', 'bar': '' })
   */
  remove(meta: string | dictionary): void {
    if (isString(meta)) {
      delete this._hash[meta as string];
    } else {
      Object.keys(meta).forEach((key) => {
        delete this._hash[serialize(key) as string];
      });
    }
  }
}
