export function range(to: number): number[];

export function range(from:number, to:number): number[];

export function range (toOrFrom: any, maybeTo?: any) {
    const [from, to] = maybeTo ? [toOrFrom, maybeTo] : [0, toOrFrom];
    return Array(to - from).fill('x').map((_, i) => from + i);
}

export const chunk = <T>(arr: Array<T>, size: number): Array<Array<T>> => {
	return arr.reduce((acc, row, idx) => {
		const t = Math.floor(idx / size);
		const grid = acc[t] || [];
		grid.push(row);
		acc[t] = grid;
		return acc;
	}, []);
}


export const delay = (ms) => (new Promise(r => setTimeout(r, ms)));

export const values = <K, V>(map: Map<K, V>) => Array.from(map.values());
export const keys = <K, V>(map: Map<K, V>) => Array.from(map.keys());
export const entries = <K, V>(map: Map<K, V>) => Array.from(map.entries());


export type ArgumentTypes<F extends Function> = F extends (...args: infer A) => any ? A : never;

export const memoize = <T extends Function>(fn: T, keyStrategy = (args: ArgumentTypes<T>) => args.join('-')) => {
	let cache = new Map();
	return (...args: ArgumentTypes<T>) => {
		const key = keyStrategy(args);
		if (!cache.get(key)) {
			const r = fn(...args);
			cache.set(key, r);
		}
		return cache.get(key);
	}
}


export const isDefined = <K>(v: K | (K | undefined)): v is K => {
	return typeof v !== 'undefined';
}