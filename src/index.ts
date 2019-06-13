import * as other from "./other";


console.log(other);

export var hasInstalled = false;

export function install(options): boolean {
  return true;
}


export const sum = (...a: number[]) =>
a.reduce((acc, val) => acc + val, 0);



