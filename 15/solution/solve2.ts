// import { puzzleInput } from "../lib/lib";
import {assert} from 'chai';
import { getTestCases } from '../runtime/lib/get-tests';
import { readInputFile } from '../runtime/lib/input-output-files';
import { createGrid, manDis } from './utils';

const parseInput = (raw: string) => {
	const rows = raw
		.split('\n')
		.map(n => n.trim())
		.filter((v) => !!v)
		.map(r => {
			const [p1, p2] = r.split(':')
			console.log(p1, p2);
			const sx = Number(p1.match(/x=(-?\d+)/)[1])
			const sy = Number(p1.match(/y=(-?\d+)/)[1])

			const cx = Number(p2.match(/x=(-?\d+)/)[1])
			const cy = Number(p2.match(/y=(-?\d+)/)[1])

			// console.log(sx, sy);
			// console.log(cx, cy);
			
			return {
				s: {x: sx, y:sy}, b: {x: cx, y: cy}
			}
			
			// return r;
		})
		// .map(Number);
		// .map(v => v.split('').map(Number));

	// return gridFromMatix(rows);
	return rows;
}


const getCount = (input, targetY) => {
	const grid = createGrid();

	input.forEach((item) => {
		const {s, b} = item;
		grid.set(s, 'S');
		grid.set(b, 'B');

		const distance = manDis(s, b);

		const distanceFromTarget = manDis(s, {x: s.x, y: targetY})
		const extra = distance - distanceFromTarget;

		for (let d = 0; d <= extra; d++) {
			const p1 = {x: s.x + d, y: targetY};
			const p2 = {x: s.x - d, y: targetY};
			const v1 = grid.get(p1)
			const v2 = grid.get(p2)
			if (!v1) {
				grid.set(p1, '#');
			}

			if (!v2) {
				grid.set(p2, '#');
			}
		}
	});
		
	return grid.reduce((curr, val, pos) => {
		return pos.y === targetY && val === '#' ? curr + 1 : curr;
	}, 0);
}

export const solve = (raw: string, max = 4000000): any => {
	const input = parseInput(raw);

	const grid = createGrid();


	const mul = 4000000;

	const areas = [];


	for (let x = 0; x < max; x++) {
		for (let y = 0; y < max; y++) {
			
		}
		if (x % 1000 === 0) {
			console.log(x);
			
		}
		// console.log(x);;
		
	}
	console.log('done')

	// input.forEach((item) => {
	// 	const {s, b} = item;
	// 	grid.set(s, 'S');
	// 	grid.set(b, 'B');

	// 	const distance = manDis(s, b);

	// 	const distanceFromTarget = manDis(s, {x: s.x, y: 10})
	// 	const extra = distance - distanceFromTarget;


	// 	for (let d = 0; d <= extra; d++) {
	// 		const p1 = {x: s.x + d, y: 10};
	// 		const p2 = {x: s.x - d, y: 10};
	// 		const v1 = grid.get(p1)
	// 		const v2 = grid.get(p2)
	// 		if (!v1) {
	// 			grid.set(p1, '#');
	// 		}

	// 		if (!v2) {
	// 			grid.set(p2, '#');
	// 		}
	// 	}
	// });


	// return grid.reduce((curr, val, pos) => {
	// 	return pos.y === 10 && val === '#' ? curr + 1 : curr;
	// }, 0);
};

// for wallaby
describe('part 1 tests', () => {
	it('passes for case 1 if exists', () => {
		const case1 = getTestCases()[0];
		if (case1) {
			const actual = solve(case1.input, 10);			
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
