// import { puzzleInput } from "../lib/lib";
import {assert} from 'chai';
import { getTestCases } from '../runtime/lib/get-tests';
import { readInputFile } from '../runtime/lib/input-output-files';
import { adj, calc, distance, isSame, neigh, neighDiag } from './lib';

const parseInput = (raw: string) => {
	const rows = raw
		.split('\n')
		.map(r => {
			return r.split(',').map(Number);
		})
	return rows;
}

export const solve = (raw: string): any => {
	const input = parseInput(raw);

	

	let sides = input.length * 6;
	const did = new Set();

	let potentialAirs = input.map(cube => {
		return neigh(cube)
	}).reduce((a, b) => ([...a, ...b]), []).filter((air, _) => {		
		return !input.find((cube) => JSON.stringify(cube) === JSON.stringify(air));
	})


	potentialAirs = potentialAirs.filter((air, idx, arr) => {
		const ind = arr.findIndex((a) => isSame(a, air));
		return ind === idx;
	});

	

	const iOf = potentialAirs.findIndex((p) => p[0] ===2 && p[1] === 2 && p[2] === 5)

	const touches = new Map();

	potentialAirs.forEach((air, i) => {

		input.forEach(cube => {
			if (adj(cube, air)) {
				const v = touches.get(i) || 0;
				touches.set(i, v + 1);
			}
		})
	});

	input.forEach((c1, i1) => {
		input.forEach((c2, i2) =>{ 

			if (i1 === i2) {
				return;
			}
			const k =[i1,i2].sort().join(',');
			if (did.has(k)) {
				return;
			}
			const isIt = adj(c1, c2);			
			if (isIt) {
				sides -= 2;
				did.add(k);
			}
		})
	})
	const trapped = Array.from(touches.entries())
		.filter(t => t[1] === 6)
		.map(t => t[0]);



	potentialAirs
	.filter((air, i) => touches.get(i) === 6)
	.forEach((air) => {
		input.forEach((cube) => {
			if (adj(air, cube)) {
				sides--;
			}
		})
	})


	console.log(trapped);
	

	console.log(potentialAirs.length);

	console.log(potentialAirs[17]);
	

	// console.log(neighDiag(potentialAirs[17]));

	// console.log(distance(input[0]))

	// const groups = 

	let max = -1;
	let outside;



	const groups = []
	potentialAirs.forEach((air, i) => {
		console.log('calc', i);
		
		if (groups.some(group => {
			return group.some(p => isSame(air, p));
		})) {
			console.log('skipped', i);
			
			return;
		}
		const chunk= calc(air, input);
		groups.push(chunk)
	
		if (chunk.length > max) {
			max = chunk.length;
			outside = chunk;
		}
	});


	return outside.reduce((acc, air, i) => {
		const cnt = input.filter(pos => adj(pos, air)).length;
		return acc + cnt;
	}, 0)


	
	return 
	

	

	return sides;
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

	it.only('passes for case 2 if exists', () => {
		const case2 = getTestCases()[1];
		if (case2) {
			const actual = solve(case2.input);
			assert.equal(actual, case2.expected);
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
