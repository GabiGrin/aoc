// import { puzzleInput } from "../lib/lib";
import {assert} from 'chai';
import { getTestCases } from '../runtime/lib/get-tests';
import { readInputFile } from '../runtime/lib/input-output-files';
import { bottom, bottomLeft, bottomRight, createGrid, range } from './utils';

const parseInput = (raw: string) => {
	const rows = raw
		.split('\n')
		.map(n => n.trim())
		.filter((v) => !!v)
		.map(r => {
			return r.split('->').map(pair => {
				const [x, y] = pair.trim().split(',');
				return {x: Number(x), y: Number(y)}
			})
		})
		// .map(Number);
		// .map(v => v.split('').map(Number));

	// return gridFromMatix(rows);
	return rows;
}

export const solve = (raw: string): any => {
	const input = parseInput(raw);

	const grid = createGrid();



	input.forEach((rock) => {
		rock.forEach((pos, idx) => {
			const prev = rock[idx - 1];

			if (prev) {
				if (prev.x === pos.x) {
					const x = prev.x;
					const minY = Math.min(prev.y, pos.y);
					const maxY = Math.max(prev.y, pos.y);
					for (let y = minY; y <= maxY; y++) {

						// console.log(x, y);
						
						grid.set({x, y}, '#');
					}

				} else {
					const y = prev.y;
					const minX = Math.min(prev.x, pos.x);
					const maxX = Math.max(prev.x, pos.x);
					for (let x = minX; x <= maxX; x++) {
						grid.set({x, y}, '#');
					}

				}
			}
			
		});
	});

	// console.log(grid.toString());
	

	const sandSource = {x: 500, y: -1}
	const lowestPoint = grid.reduce((c, _, {y}) => Math.max(y, c), 0)

	let sand = sandSource;

	let lastY = -42;
	while (sand.y !== lastY) {
		const next = [bottom, bottomLeft, bottomRight].map(fn => fn(sand)).filter((pos) => {
			const val = grid.get(pos);
			if (pos.y > lowestPoint + 1) {
				return false;
			}
			if (val !== '#' && val !== 'o') {
				return true;
			}
		})[0];

		if (next) {
			lastY = sand.y;
			sand = next;
			
		} else {
			grid.set(sand, 'o');
			sand = sandSource
		}
		// console.log(next, lowestPoint);
		
	}

	// console.log(grid.print());
	

	return grid.reduce((total, val) => total + (val === 'o' ? 1 : 0), 0)



	console.log(lowestPoint);
	



	// console.log(input);
	


	return input.length;
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
		const input = readInputFile();
		
		
		// const actual = solve(input);
		// console.log({actual});
	});
})
