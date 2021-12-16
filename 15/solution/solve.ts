// import { puzzleInput } from "../lib/lib";
import {assert} from 'chai';
import { getTestCases } from '../runtime/lib/get-tests';
import { calcNeighbours, createGrid, gridFromMatix, id, range, Vector, vectorAdd, vectorEquals } from './utils';
import { createGraph } from './utils/graphs';

const parseInput = (raw: string) => {
	const rows = raw
		.split('\n')
		.map(n => n.trim())
		.filter((v) => !!v)
		// .map(Numbe/r);
		.map(v => v.split('').map(Number));

	const initGrid = gridFromMatix(rows);

	const w = initGrid.width();
	const h = initGrid.height();

	return initGrid.reduce((newGrid, val, pos) => {

		for (let xm = 0; xm < 5; xm++) {
			for (let ym = 0; ym < 5; ym++) {
				const d = xm + ym;
				
				const newPos = {
					x: pos.x + xm * w,
					y: pos.y + ym * h
				};
			
				const v = val + d;
				newGrid.set(newPos, v > 9 ? (v % 9) : v);
			}
		}
		return newGrid;
		
	}, createGrid<number>());

}

export const solve = (raw: string): any => {
	const grid = parseInput(raw);

	const w = grid.width();
	const h = grid.height();
		
	let steps = 0;

	console.log({w, h});
	
	
	const from = {x: 0, y: 0};
	const end = {x: w - 1, y: h - 1};
	let queue = [{pos: from, total: 0, path: []}];
	let minRisk = Infinity;
	const find = () => {

		const totals = new Map();

		const visited = new Set();
		while (queue.length) {
			queue = queue.sort((e1, e2) => {
				return e1.total - e2.total;
			});
			const curr = queue.shift();

			if (visited.has(id(curr.pos))) {
				continue;
			}
			
			visited.add(id(curr.pos));

			const currTotal = curr.total;
			const currKey = id(curr.pos);

			totals.set(currKey, currTotal);

			if (vectorEquals(curr.pos, end)) {
				if (curr.total < minRisk) {
					return curr.total;
				}
				// return curr;
			} else {
				const neigh = calcNeighbours(curr.pos)
					.filter(pos => grid.get(pos))
					.filter(pos => {
						const cond = !curr.path.find(np => vectorEquals(np, pos))
						
						return cond;
					})
					.map(pos => {
						return {
							pos, total: currTotal + grid.get(pos),
							path: [...curr.path, pos]
						}
					})
					.filter((n) => {
						const prevTotalHere = totals.get(id(n.pos)) || Infinity;
						return n.total < prevTotalHere;
					})

				queue.push(...neigh);
			}

			if (steps++ % 10000 === 0) {
				console.log({l: queue.length, minRisk});
			}
		}
	
		return minRisk;
	}

	const paths = find();

	console.log(queue.length);
	

	// console.log(paths.path.map( p => grid.get(p)));
	
	return paths;
	
};

// for wallaby
describe('part 1 tests', () => {
	it('passes for case 1 if exists', () => {
		const case1 = getTestCases()[0];
		if (case1) {
			const actual = solve(case1.input);
			assert.equal(actual, case1.expected);
		} else {
			// no test case
		}
	});

	it('passes for case 2 if exists', () => {
		const case2 = getTestCases()[1];
		if (case2) {
			const actual = solve(case2.input);
			assert.equal(actual, case2.expected);
		} else {
			// no test case
		}
	});

	it('passes for case 3 if exists', () => {
		const case3 = getTestCases()[2];
		if (case3) {
			const actual = solve(case3.input);
			assert.equal(actual, case3.expected);
		} else {
			// no test case
		}
	});

	it('passes for case 4 if exists', () => {
		const case4 = getTestCases()[3];
		if (case4) {
			const actual = solve(case4.input);
			assert.equal(actual, case4.expected);
		} else {
			// no test case
		}
	});

	it('passes for case 5 if exists', () => {
		const case5 = getTestCases()[4];
		if (case5) {
			const actual = solve(case5.input);
			assert.equal(actual, case5.expected);
		} else {
			// no test case
		}
	});

	it('passes input if exists', () => {
		// const input = readInputFile();
		
		
		// const actual = solve(input);
		// console.log({actual});
	});
})
