// import { puzzleInput } from "../lib/lib";
import {assert} from 'chai';
import { getTestCases } from '../runtime/lib/get-tests';
import { calcNeighbours, createGrid, gridFromMatix, id, Vector, vectorAdd, vectorEquals } from './utils';
import { createGraph } from './utils/graphs';

const parseInput = (raw: string) => {
	const rows = raw
		.split('\n')
		.map(n => n.trim())
		.filter((v) => !!v)
		// .map(Numbe/r);
		.map(v => v.split('').map(Number));

	const initGrid = gridFromMatix(rows);

	return initGrid;

}

export const solve = (raw: string): any => {
	const grid = parseInput(raw);

	const rw = grid.width();
	const rh = grid.height();

	const w = grid.width() * 5;
	const h = grid.height() * 5;
	
	
	

	let steps = 0;

	const getValue = (pos: Vector) => {
		const x = pos.x % rw;
		const y = pos.y % rh;

		const disX = Math.floor(pos.x / rw);
		const disY = Math.floor(pos.y / rh);

		const dis = disX + disY;
		const value = grid.get({x, y});
		const nv = value + dis;
		return nv > 9 ? (nv % 9) : nv;
		// return (value + dis) % 9 + 1;
	}


	const score = (curr) => {
		return curr.total;
	}
	
	const from = {x: 0, y: 0};
	const end = {x: w - 1, y: h - 1};
	let queue = [{pos: from, total: 0, depth: 0}];
	let minRisk = Infinity;
	const find = () => {

		const totals = new Map();


		const visited = new Set();
		while (queue.length) {

			queue = queue.sort((e1, e2) => {
				return score(e1) - score(e2);
			});
		
			
			const curr = queue.shift();
			if (visited.has(id(curr.pos))) {
				continue;
			}

			visited.add(id(curr.pos));
			const currTotal = curr.total; // + grid.get(curr.pos);

			const currKey = id(curr.pos);
			const prevTotalHere = totals.get(currKey) || Infinity;

			if (prevTotalHere <= currTotal) {
				// been here with a better path
				continue
			}

			totals.set(currKey, currTotal);
			
	
			if (vectorEquals(curr.pos, end)) {
				console.log('found end', curr.pos, curr.total);
				
				if (curr.total < minRisk) {
					minRisk = curr.total;
				}
				// return curr;
			} else {
				const neigh = calcNeighbours(curr.pos)
					.filter(pos => {
						return (pos.x >= 0 && pos.x < w) && (pos.y >= 0 && pos.y < h);
					})
					.map(pos => {
						return {
							pos, total: currTotal + getValue(pos),
							depth: curr.depth + 1
						}
					})
					.filter((n) => {
						const prevTotalHere = totals.get(id(n.pos)) || Infinity;
						return n.total < prevTotalHere;
					})
				
				queue.push(...neigh);

			}

			if (steps++ % 10000 === 0) {
				// console.log(queue.map(score))
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
