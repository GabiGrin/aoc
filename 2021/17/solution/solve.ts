// import { puzzleInput } from "../lib/lib";
import {assert} from 'chai';
import { createVerify } from 'crypto';
import { create } from 'domain';
import { getTestCases } from '../runtime/lib/get-tests';
import { readInputFile } from '../runtime/lib/input-output-files';
import { createVec, range, Vector, vectorAdd } from './utils';

const parseInput = (raw: string) => {
	const rows = raw
		.match(/x=(-?\d+)\.+(-?\d+), y=(-?\d+)\.+(-?\d+)/)
		
	const [x1, x2, y1, y2] = rows.slice(1, 100).map(Number);
	console.log({x1, x2, y1, y2});
	
	// return gridFromMatix(rows);
	return {x1, x2, y1, y2};
}

export const solve = (raw: string): any => {
	const {x1, x2, y1, y2} = parseInput(raw);

	

	let step = (pos, vel) => {
		const  p = vectorAdd(pos, vel);

		const vy = vel.y - 1;		
		
		const vx = vel.x > 0 ? ( vel.x - 1)  : (vel.x < 0 ? vel.x + 1 : vel.x);

		return {p, v: createVec(vx, vy)}
	}

	const isInReach = ({x, y}) => {		
		return x >= x1 && x <= x2 && y >= y1 && y <= y2;
	}

	const isOutOfReach = ({x, y}) => {
		return x > x2 || y < y1;
	}
	
	const checkVel = (initVel: Vector) => {
		let pos = createVec(0, 0);
		let vel = initVel;

		let maxY = pos.y;
	
		while (!isOutOfReach(pos)) {
			maxY = Math.max(maxY, pos.y);
			if (isInReach(pos)) {
				return maxY;
			}
			let {p, v} = step(pos, vel);
			pos = p;
			vel = v;
		}
		return -1;
	}

	// // let maxX = 1000;

	let opts = 0;
	for (let vx = 0; vx < 1000; vx++) {


		let foundHere = false;
		for (let vy = -1000; vy < 1000; vy++) {
			
			const v = createVec(vx, vy);
			const my = checkVel(v);

			if (my !== -1){
				opts++;
				foundHere = true
			}	
			// maxY = Math.max(my, maxY);
		}
		// if (!foundHere) {
		// 	// break;
		// }
	}

	return opts;


		
	// // }
	// console.log(checkVel({x: 6, y: 9}));
	

	// // const max = ans.map(a => a.maxY);
	// return Math.max(...max)


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
