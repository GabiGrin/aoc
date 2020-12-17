
export type P = {x: number, y: number, z: number, w: number};
export const id = (p: P) => `${p.x}|${p.y}|${p.z}|${p.w}`;

export const fromId = str => str.split('|').map((n) => parseInt(n));

export const getCell = ({ x, y, z, w }, map) => map.get(id({x,y, z, w}));
export const setCell = ({ x, y, z, w }, v, map) => map.set(id({x, y, z, w}), v);

// export const top = ({ x, y }) => ({ x, y: y - 1 });
// export const topLeft = ({ x, y }) => ({ x: x - 1, y: y - 1 });
// export const topRight = ({ x, y }) => ({ x: x + 1, y: y - 1 });
// export const bottom = ({ x, y }) => ({ x, y: y + 1 });
// export const bottomLeft = ({ x, y }) => ({ x: x - 1, y: y + 1 });
// export const bottomRight = ({ x, y }) => ({ x: x + 1, y: y + 1 });
// export const left = ({ x, y }) => ({ x: x - 1, y });
// export const right = ({ x, y }) => ({ x: x + 1, y });

export const manDis = (p: P) => Math.abs(p.x) + Math.abs(p.y);

// export const dirs = {
// 	U: top,
// 	D: bottom,
// 	L: left,
// 	R: right
// };

export const values = <K, V>(map: Map<K, V>) => Array.from(map.values());
export const entries = <K, V>(map: Map<K, V>) => Array.from(map.entries());

export type LlNode = {val: any, next?: LlNode};
export const llNode = (val: any): LlNode => ({val});

export type GraphNode = {val: any, children: GraphNode[]};
export const graphNode = (val: any): GraphNode => ({val, children: []});
