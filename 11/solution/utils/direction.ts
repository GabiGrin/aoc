import { Vector } from "./vectors";


export const top = ({ x, y }) => ({ x, y: y - 1 });
export const topLeft = ({ x, y }) => ({ x: x - 1, y: y - 1 });
export const topRight = ({ x, y }) => ({ x: x + 1, y: y - 1 });
export const bottom = ({ x, y }) => ({ x, y: y + 1 });
export const bottomLeft = ({ x, y }) => ({ x: x - 1, y: y + 1 });
export const bottomRight = ({ x, y }) => ({ x: x + 1, y: y + 1 });
export const left = ({ x, y }) => ({ x: x - 1, y });
export const right = ({ x, y }) => ({ x: x + 1, y });

export const neighbours = [top, left, bottom, right];

export const diagonals = [topLeft, topRight, bottomLeft, bottomRight];

export const neighboursWithDiag = [...neighbours, ...diagonals];

export const calcNeighbours = (v: Vector) => {
    return neighbours.map(f => f(v));
}

export const calcNeighboursWithDiag = (v: Vector) => {
    return neighboursWithDiag.map(f => f(v));
}

export const dirs = {
	U: top,
	D: bottom,
	L: left,
	R: right
};