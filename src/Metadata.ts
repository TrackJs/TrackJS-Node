import serialize from "./utils/serialize";
import { isString } from "./utils/isType";

interface dictionary {
  [key: string]: string
}

export class Metadata {

  private _hash: dictionary = {};

  constructor(initialValues?: dictionary) {
    if (!initialValues) { return; }
    this.add(initialValues);
  }

  add(meta: string | dictionary, value?: string): void {
    if (isString(meta)) {
      this._hash[meta as string] = value;
    }
    else {
      Object.keys(meta).forEach((key) => {
        this._hash[serialize(key)] = serialize(meta[key]);
      })
    }
  }

  get(): Array<{ key: string, value: string}> {
    return Object.keys(this._hash).map((key) => {
      return { key, value: this._hash[key] };
    });
  }

  remove(meta: string | dictionary): void {
    if (isString(meta)) {
      delete this._hash[meta as string];
    }
    else {
      Object.keys(meta).forEach((key) => {
        delete this._hash[serialize(key) as string];
      })
    }
  }

}

