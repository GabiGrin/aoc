// import { puzzleInput } from "../lib/lib";
import {assert} from 'chai';
import { getTestCases } from '../runtime/lib/get-tests';
import { readInputFile } from '../runtime/lib/input-output-files';
import { chunk } from './utils';

const parseInput = (raw: string) => {
	const rows = raw
		.split('\n')
		.map(n => n.trim())
		.filter((v) => !!v)
		.map(r => {
			const [c, a] = r.split(' ')
			console.log(c, a);
			return {c, a: Number(a)}
			// return r;
		})
		// .map(Number);
		// .map(v => v.split('').map(Number));

	// return gridFromMatix(rows);
	return rows;
}

export const solve = (raw: string): any => {
	const input = parseInput(raw);
	let x = 1;
	const signals = [20, 60, 100, 140, 180, 220];

	let v = 0;
	
	let cycles = 0;

	const check = () => {
		if (signals.includes(cycles)) {
			console.log(cycles, x, x * cycles);
			v+= x * cycles;
		}

	}

	const tape = [];
	// tape.push({cycles, x})
	// cycles++;
	input.forEach((cmd) => {
		const {a, c} = cmd;
		if (c === 'noop') {
			check();
			tape.push({cycles, x})
			cycles++;
		} else {
			// console.log(cycles, a, c);
			tape.push({cycles, x})
			check();
			cycles++;
			check();
			tape.push({cycles, x})
			cycles++;
			x+=a;

		}
	})

	const screen = [];
	let row = [];
	tape.forEach((item) => {
		const pos = item.cycles;
		const sprite = [item.x- 1, item.x, item.x + 1];
		// console.log(pos);
		console.log(sprite, pos);
		
		if (sprite.includes(pos - 40 * screen.length)) {
			row.push('#')
		} else {
			row.push('.')
		}
		if (row.length === 40) {
			screen.push(row);
			row = [];
		}
		
	});

	// const parts = chunk(screen, 40);
	console.log(screen.map(s => s.join('')));
	
	// console.log(parts.map(s => s.join('')));
	

	// console.log(tape);
	
	// console.log(cycles, x);
	
	return v;


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
