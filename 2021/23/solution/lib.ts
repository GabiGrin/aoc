import { Grid, Vector, id, vectorEquals, calcNeighbours, createGrid } from "./utils";




export const letters = ['A', 'B', 'C', 'D'];

export const calcInitPos = (input: Grid<any>) => {
	return input.reduce((poses, val, vec) => {
		if (letters.includes(val)) {

			const k1 = `${val}1`;
			const k2 = `${val}2`;
			const k3 = `${val}3`;
			const k4 = `${val}4`;

			if (poses[k4]) {
				throw 'bob'
			}

			if (poses[k3]) {
				poses[k4] = vec
			} else if (poses[k2]) {
				poses[k3] = vec
			} else if (poses[k1]) {
				poses[k2] = vec
			} else {
				poses[k1] = vec;
			}
		}
		return poses;
	}, {}) as State;
}


export const cost = {
	A1: 1,
	A2: 1,
	A3: 1,
	A4: 1,
	B1: 10,
	B2: 10,
	B3: 10,
	B4: 10,
	C1: 100,
	C2: 100,
	C3: 100,
	C4: 100,
	D1: 1000,
	D2: 1000,
	D3: 1000,
	D4: 1000
}

export const restPositions = [
	{x: 1, y: 1},
	{x: 2, y: 1},
	{x: 4, y: 1},
	{x: 6, y: 1},
	{x: 8, y: 1},
	{x: 10, y: 1},
	{x: 11, y: 1},
]

export const restPositionIds = restPositions.map(id);

export const isResting = (pos: Vector) => {    
	return restPositionIds.indexOf(id(pos)) !== -1;
}

export const rooms = {
	A1: 3,
	A2: 3,
	A3: 3,
	A4: 3,
	B1: 5,
	B2: 5,
	B3: 5,
	B4: 5,
	C1: 7,
	C2: 7,
	C3: 7,
	C4: 7,
	D1: 9,
	D2: 9,
	D3: 9,
	D4: 9,
}

export type State = {
	A1: Vector,
	A2: Vector,
	A3: Vector,
	A4: Vector,
	B1: Vector,
	B2: Vector,
	B3: Vector,
	B4: Vector,
	C1: Vector,
	C2: Vector,
	C3: Vector,
	C4: Vector,
	D1: Vector,
	D2: Vector,
	D3: Vector,
	D4: Vector,
}

export const canGo = (grid: Grid, state: State, type: keyof State, to: Vector) => {
	const queue = [{p: state[type], l: 0}];

	let visited = new Set();

	const blocked = new Set(Object.entries(state)
		.filter(([k, t]) => k !== type)
		.map(([k, v]) => v)
		.map(p => id(p))
	);

	while (queue.length) {
		 const {p, l} = queue.shift();

         if (visited.has(id(p))) {
             throw 'bob';
             continue;
         }

		 if (vectorEquals(p, to)) {
			 return {p, l};
		 }
		 visited.add(id(p));
		 const neigh = calcNeighbours(p)
		 	.filter(np => {
				 const v = grid.get(np);
				 return v !== '#'
			 })
			 .filter(np => {
				return !blocked.has(id(np)) && !visited.has(id(np));
			 })
			 .map(np => ({p: np, l: l + 1 }))
		
		queue.push(...neigh);
	}
	return false;
}

export const isDone = (state: State) => {
	return Object.entries(state)
		.every(([k, v]) => {
			return v.x === rooms[k];
		});
}


export const print = (grid: Grid, state: State) => {
	const ng = grid.reduce((acc, val, pos) => {
		if (val == '#' || val === ' ') {
			return acc.set(pos, val);
		}
		const f = Object.entries(state)
			.find(([k, v]) => {
				
				return vectorEquals(v, pos);
			});
		if (f) {
			return acc.set(pos, f[0].substring(0, 1));
		}
		return acc.set(pos, '.')
	
	}, createGrid())
	
	return ng.toString();
}

export const strState = (s: State) => {
    let str = `${id(s.A1)},${id(s.A2)},${id(s.B1)},${id(s.B2)},${id(s.C1)},${id(s.C2)},${id(s.D1)},${id(s.D2)}`;
    str += `${id(s.A3)}|${id(s.A4)}|${id(s.B3)}|${id(s.B4)}|${id(s.C3)}|${id(s.C4)}|${id(s.D3)}|${id(s.D4)}`
    return str;
}
