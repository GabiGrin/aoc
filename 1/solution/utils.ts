
export type P = {x: number, y: number};
export const id = (p: P) => `${p.x}|${p.y}`;

export const seq = (n: number) => Array(n).fill('x').map((_, i) => i);

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
