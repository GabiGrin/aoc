import { puzzleInput } from "./puzzle-input";
import {assert} from 'chai';
import { setCell } from "./utils";
import { isConstructorDeclaration } from "typescript";


const parseInput = (raw: string) => {
	const rows = raw
		.split('\n')
		.map(n => n.trim())
	
	const [earliest, buses] = rows;
		// .map(Number);

	// const grid = new Map();
	// rows.forEach((row, y) => {
	// 	row.split('').forEach((cell, x)  => {
	// 		const value = cell;
	// 		setCell({x, y}, value, grid);
	// 	})
	// });

	


	// 2893720453129 + 4646149166293 n

	return buses.split(',').map(Number);
}

export const solve = (raw: string, starting = 104541000000000): any => {
	const buses = parseInput(raw) as any;


	/*
	740626937042 + 1473169247849 n -> "((x + 0) modulo 29 = 0) and ((x + 23) modulo 37 = 0) and ((x + 29) modulo 631 = 0) and ((x + 47) modulo 13 = 0) and ((x + 48) modulo 19 = 0) and ((x + 52) modulo 23 = 0) and ((x + 60) modulo 383 = 0)"
	we're left with  ((x + 70) modulo 41 = 0) and ((x + 77) modulo 17 = 0)
	*/

	const start = 740626937042;
	const jump = 1473169247849;

	let bobs = buses.map((b, i) => {
		return {b, i}
	}).filter(({b}) => !isNaN(b));

	const forWolfram = bobs.map(({b, i}) => {
		return `((x + ${i}) modulo ${b} = 0)`
	}).join(' and ');
	// console.log(forWolfram);

	// return true;

	// console.log(buses);

	
	let t = starting;
	let found = false;

	bobs = [{
		b: 41,
		i:70
	}, {
		b: 17,
		i: 77
	}]
	// return;

	let s = start;

	// 7539869619422
	// 100000000000000
	// 184093537938556

	while (!found) {

		const f1 = (s + bobs[0].i) % bobs[0].b === 0;
		const f2 = (s + bobs[1].i) % bobs[1].b === 0;

		console.log(f1, f2);

		if (f1 && f2) {
			return s;
		}
		s = s + jump;

	}
	
	
	return s;

	// return input.length;
};

// 7,13,x,x,59,x,31,19` (x mod 7 = 0 and (x+1 ) mod 13 = 0 and (x+3) mod 59 =0 and (x+5) mod 31 = 0 and (x+6) mod 19 = 0
// 67,7,59,61  (x mod 67 = 0) and (x+1 mod 7 = 0) and (x + 2 mod 59 = 0) and (x + 3 mod 61 =  0)

describe('bob', () => {
	it('works for test case 1', () => {
		const input = `939
7,13,x,x,59,x,31,19`;
		// assert.equal(solve(input, 0), 1068781);

		assert.equal(solve(`g
// 17,x,13,19`, 0), 3417);
	});

// 	it('blob', () => {
// 		assert.equal(solve(`g
// 67,7,x,59,61`, 0), 1261476);
// 	});


	// it('works for test case 2', () => {
	// 	const input = `HERE`;

	// 	assert.equal(solve(input), 424242);
	// });

	it('show the answer when ready!', () => {

		// const expected = 42;

		// assert.equal(solve(puzzleInput), 'bob');
	});
});



/*

112300934 + 167234561 n

475243 + 6139873 n


*/