export type Vector = {x: number, y: number};
export const manDis = (p: Vector, p2: Vector) => Math.abs(p2.x - p.x) + Math.abs(p2.y - p.y);

export const createVec = (x, y):Vector  => ({x, y});

export const vectorLength = ({x, y}: Vector) => Math.sqrt(Math.pow(x, 2) + Math.pow(y, 2));

export const vectorAdd = ({x: x1, y: y1}: Vector, {x: x2, y: y2}: Vector) => createVec(x1+x2, y1+y2);
export const vectorSub = ({x: x1, y: y1}: Vector, {x: x2, y: y2}: Vector) => createVec(x1-x2, y1-y2);
export const vectorMul = ({x: x1, y: y1}: Vector, {x: x2, y: y2}: Vector) => createVec(x1*x2, y1*y2);
export const vectorDiv = ({x: x1, y: y1}: Vector, {x: x2, y: y2}: Vector) => createVec(x1/x2, y1/y2);

export const vectorsDis = (v1, v2) => vectorLength(vectorSub(v1, v2));

export const vectorEquals = ({x: x1, y: y1}, {x: x2, y: y2}) => x1 === x2 && y1 === y2;