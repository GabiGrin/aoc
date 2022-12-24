// import { puzzleInput } from "../lib/lib";
import {assert} from 'chai';
import { getTestCases } from '../runtime/lib/get-tests';
import { readInputFile } from '../runtime/lib/input-output-files';
import { calcNeighbours, gridFromMatix } from './utils';

const parseInput = (raw: string) => {
	const rows = raw
		.split('\n')
		.map(n => n.trim())
		.filter((v) => !!v)
		.map(r => {
			return r.split('').map(s => {
				if (s !== 'E' && s !== 'S') {
					return s.charCodeAt(0)
				} else {
					return s;
				}
			});
		})

	
	

	

	

	
		// .map(Number);
		// .map(v => v.split('').map(Number));

	// return gridFromMatix(rows);
	return rows;
}

export const solve = (raw: string): any => {
	const input = parseInput(raw);


	let startPos = [];
	input.forEach((arr, y) => {
		arr.forEach((cell, x) => {
			if (cell === 'S' || cell === 'a'.charCodeAt(0)) {
				startPos.push({x,y});
			}
		});
	})
	
	const grid = gridFromMatix(input);


	const queue = startPos.map(p => ({pos: p, steps: 0}))
	let vis = new Set();
	const hasVis = ({x, y}) => vis.has(`${x},${y}`);
	const addVis = ({x, y}) => vis.add(`${x},${y}`);

	const found = [];

	let it = 0;

	while (queue.length) {
		const next = queue.shift();


		let currVal: any = grid.get(next.pos);
		addVis(next.pos);

		// const grid2 = grid.map(c => '.');

		if (currVal === 'E') {
			// console.log(next.path);
			// next.path.forEach((p, i) => grid2.set(p, 'X' as any))
			// console.log(grid2.toString());
			
			
			return next.steps ;
		}

		const nextValid = (newVal) => {
			// return true;

			
			if (currVal === 'S') {
				currVal = 'a'.charCodeAt(0)
			}
			if (newVal === 'E') {
				newVal = 'z'.charCodeAt(0)
			}

			if (currVal >= newVal ) {
				return true;
			}			

			return newVal - currVal <= 1;

		}
		
		const matches = calcNeighbours(next.pos)
			.filter(pos => {
				const val = grid.get(pos)
				// console.log(val, curVal);
				
				return !hasVis(pos)
				&& val && nextValid(val)
			})
			.map(p => {
				const val = grid.get(p)
				const mod = (val === 'a'.charCodeAt(0)) ? 0 : 1;
				return {pos: p, steps: next.steps + mod, path: []};
			})

		matches.forEach(m => addVis(m.pos));

		if (it++ % 1000 === 0) {
			console.log('it', it);
			
		}
		
		queue.push(...matches);
		
	}
	

	// return input.length;
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
