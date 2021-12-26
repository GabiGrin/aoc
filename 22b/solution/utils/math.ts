import { range } from "./misc";

export const factorial = (num) => range(1, num + 1).reduce((a, b) => a * b, 1);

export const simpleAdd = (a, b) => a + b;
export const simpleSub = (a, b) => a - b;
export const simpleMul = (a, b) => a * b;
export const simpleDiv = (a, b) => a / b;

export const sigma = (num) => range(1, num + 1).reduce((a, b) => a + b, 0);