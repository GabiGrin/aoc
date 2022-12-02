import { createVec, entries, isDefined, keys, memoize, Vector } from ".";
import { Matrix, reduceMatrix } from "./matrices";

export type P = {x: number, y: number, z: number};
export const id = (p: P) => `${p.x}|${p.y}|${p.z}`;
export const fromId = str => {
    const [x, y, z] = str.split('|').map((n) => parseInt(n));
    return createVec(x, y, z);
}

export const getCell = ({ x, y, z }, map) => map.get(id({x,y,z}));
export const setCell = ({ x, y, z }, v, map) => map.set(id({x, y,z}), v);


export type Grid<T> = {
    get: (pos: Vector, defaultValue?: T) => T | undefined,
    set: (pos: Vector, val:T) => void,
    inc: (pos: Vector) => number,
    dec: (pos: Vector) => number,
    copy: () => Grid<T>,
    width: () => number,
    height: () => number,
    map: <K>(fn: (val: T, pos: Vector, grid: Grid<T>) => K) => Grid<K>,
    reduce: <Acc>(fn: (acc: Acc, val: T, pos: Vector, grid: Grid<T>) => Acc, init: Acc) => Acc,
    getInner: () => Map<string, T>,
    toString: () => string,
    print: () => void
}


// export const gridFromMatix = <T>(mat: Matrix<T>): Grid<T> => {
//     const map = reduceMatrix(mat, (acc, val, y, x, z) => {
//         const k = id({x, y, z});
//         return acc.set(k, val);
//     }, new Map<string, T>())
//     return createGrid(map);
// }

export const createGrid = <T>(inner: Map<string, T> = new Map()): Grid<T> => {

    const get = (pos: Vector) => inner.get(id(pos));
    const set = (pos: Vector, val) => inner.set(id(pos), val);

    const grid: Grid<T> =  {
        get: (pos, defaultValue) => {
            const v = get(pos);
            if (typeof v === 'undefined') {
                return defaultValue
            } else {
                return v;
            }
        },
        set: (pos, val) => {
            set(pos, val)
        },
        inc: (pos) => {
            const v = get(pos);
            if (typeof v !== 'number') {
                throw new Error(`cannot inc non numerical value - ${v} on pos ${pos}`);
            }
            set(pos, v + 1);
            return v + 1;
        },
        dec: (pos) => {
            const v = get(pos);
            if (typeof v !== 'number') {
                throw new Error(`cannot dec non numerical value - ${v} on pos ${pos}`);
            }
            set(pos, v - 1);
            return v - 1;
        },
        copy: () => {
            return createGrid(new Map(inner))
        },
        getInner: () => inner,
        width: () => {
            const xs = keys(inner).map(k => fromId(k).x);
            
            const min = Math.min(...xs);
            const max = Math.max(...xs);
            return (max - min) + 1
        },
        height: () => {
            const ys = keys(inner).map(k => fromId(k).y);
            const min = Math.min(...ys);
            const max = Math.max(...ys);
            return (max - min) + 1;
        },
        reduce: (fn, init) => {
            return entries(inner).reduce((acc, [key, val]) => {
                const pos = fromId(key);
                return fn(acc, val, pos, grid)
            }, init);
        },
        map: <K>(fn) => {
            const newEntries = entries(inner).map(([key, val]) => {
                const pos = fromId(key);
                const newVal: K = fn(val, pos, grid);
                return [key, newVal] as [string, K];
            });
            const newMap = new Map(newEntries);
            return createGrid(newMap)
        },
        toString: () => {
            const buffer = [];

            const poses = keys(inner).map(fromId);
            const xs = poses.map(p => p.x);
            const ys = poses.map(p => p.y);

            const fromX = Math.min(...xs);
            const toX = Math.max(...xs);

            const fromY = Math.min(...ys);
            const toY = Math.max(...ys);

            buffer.push(`width = ${grid.width()} | minX = ${fromX} | maxX = ${toX}`);
            buffer.push(`height = ${grid.height()} | minY = ${fromY} | maxY = ${toY}`);
            buffer.push('='.repeat(40))
            
            for (let y = fromY; y <= toY; y++) {
                const row = [];
                for (let x = fromX; x <= toX; x++) {
                    // const val = grid.get({x, y})
                    // row.push(isDefined(val) ? val : '∅');
                }
                buffer.push(row.join(''));
            }

            return buffer.join('\n');
        },
        print: () => {
            const str = grid.toString();
            console.log(str);
            return str;
        }
    }

    return grid;

}