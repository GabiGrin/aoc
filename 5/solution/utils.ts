import { access } from "fs";

export type P = {x: number, y: number};
export const id = (p: P) => `${p.x}|${p.y}`;

export function range(to: number): number[];

export function range(from:number, to:number): number[];

export function range (toOrFrom: any, maybeTo?: any) {
	const [from, to] = maybeTo ? [toOrFrom, maybeTo] : [0, toOrFrom];
	return Array(to - from).fill('x').map((_, i) => from + i);
}

export const delay = (ms) => (new Promise(r => setTimeout(r, ms)));

export const fromId = str => str.split('|').map((n) => parseInt(n));

export const getCell = ({ x, y }, map) => map.get(id({x,y}));
export const setCell = ({ x, y }, v, map) => map.set(id({x, y}), v);

export const top = ({ x, y }) => ({ x, y: y - 1 });
export const topLeft = ({ x, y }) => ({ x: x - 1, y: y - 1 });
export const topRight = ({ x, y }) => ({ x: x + 1, y: y - 1 });
export const bottom = ({ x, y }) => ({ x, y: y + 1 });
export const bottomLeft = ({ x, y }) => ({ x: x - 1, y: y + 1 });
export const bottomRight = ({ x, y }) => ({ x: x + 1, y: y + 1 });
export const left = ({ x, y }) => ({ x: x - 1, y });
export const right = ({ x, y }) => ({ x: x + 1, y });

export const manDis = (p: P) => Math.abs(p.x) + Math.abs(p.y);

export const vectorLength = ({x, y}: P) => {
	return Math.sqrt(Math.pow(x, 2) + Math.pow(y, 2))
}

export const vectorAdd = (p1: P, p2: P) => {
	return {x: p1.x + p2.x, y: p1.y + p2.y}
}

export const vectorSub = (p1: P, p2: P) => {
	return {x: p1.x - p2.x, y: p1.y - p2.y}
}

export const vectorMul = (p1: P, s: number) => {
	return {x: p1.x * s, y: p1.y * s}
}

export const vectorDiv = (p1: P, s: number) => {
	return {x: p1.x / s, y: p1.y / s}
}

export const vectorsDis = (p1: P, p2: P) => {
	const d = vectorSub(p2, p1);
	return vectorLength(d);
}

export const dirs = {
	U: top,
	D: bottom,
	L: left,
	R: right
};

export const values = <K, V>(map: Map<K, V>) => Array.from(map.values());
export const entries = <K, V>(map: Map<K, V>) => Array.from(map.entries());

export type LlNode = {val: any, next?: LlNode};
export const llNode = (val: any): LlNode => ({val});

export type GraphNode = {val: any, children: GraphNode[]};
export const graphNode = (val: any): GraphNode => ({val, children: []});


export const chunk = <T>(arr: Array<T>, size: number): Array<Array<T>> => {
	return arr.reduce((acc, row, idx) => {
		const t = Math.floor(idx / size);
		const grid = acc[t] || [];
		grid.push(row);
		acc[t] = grid;
		return acc;
	}, []);
}

export type Matrix<T> = Array<Array<T>>;

export const rotateMatrixClockWise = <T>(mat: Matrix<T>) => {
	return mat[0].map((_, index) => (
		mat.map(row => row[index])
	)).reverse();
}

export const reduceMatrix = <T, Acc>(mat: Matrix<T>, reducer: (acc: Acc, curr: T, rowIdx: number, colIdx: number) => Acc, init: Acc): Acc => {
	let accVal = init;
	for (let rowIdx = 0; rowIdx < mat.length; rowIdx++) {
		const row = mat[rowIdx];
		
		for (let colIdx = 0; colIdx < row.length; colIdx++) {
			const cell = row[colIdx];
			accVal = reducer(accVal, cell, rowIdx, colIdx);
		}
	}
	return accVal;
}

export const mapMatrix = <T, K>(mat: Matrix<T>, map: (curr: T, rowIdx: number, colIdx: number) => K): Matrix<K> => {
	return mat.map((row, rowIdx) => {
		return row.map((cell, colIdx) => {
			return map(cell, rowIdx, colIdx);
		})
	});
}