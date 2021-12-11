// import { puzzleInput } from "../lib/lib";
import {assert} from 'chai';
import { getTestCases } from '../runtime/lib/get-tests';
import { readInputFile } from '../runtime/lib/input-output-files';

const parseInput = (raw: string) => {
	const rows = raw
		.split('\n')
		.map(n => n.trim())
		.filter((v) => !!v)
		// .map(Number);

	return rows;
}

const pointsMap = {
	')': 1,
	']': 2,
	'}': 3,
	'>': 4
}

const iter = (s) => s
	.replace(/\(\)/g, '')
	.replace(/\<\>/g, '')
	.replace(/\[\]/g, '')
	.replace(/\{\}/g, '');

	const corrupts = ['(}', '(]', '(>', '{)', '{]', '{>', '<)', '<]', '<}', '[)', '[}', '[>'];

	const findFirstCorrupt = s => corrupts.filter(cr => s.includes(cr))
		.map(cr => [s.indexOf(cr), cr])
		.sort((a, b) => a[0] - b[0]);

export const solve = (raw: string): any => {
	const input = parseInput(raw);
	
	const findIllegal = (row, idx) => {
		const cons = consolidate(row);
		return findFirstCorrupt(cons);
	}

	const remaining = input.filter(line => {
		return findIllegal(line, 0).length === 0;
	})

	const points = remaining.map((row) => {

		const compl = findCompletionString(row);
		console.log(compl);

		return compl.split('').reduce((p, c) => {
			const v = pointsMap[c];

			return p * 5 + v;
		}, 0);
		
	});

	console.log(points);

	points.sort((a, b) => a -b);
	console.log(points);
	
	return points[Math.ceil(points.length / 2) - 1];


};

const consolidate = (row) => {
	let curr = row;

	let found = false

	let last = '';
	let repeat = 0;

	while (repeat < 10 && !found) {
		last = curr;
		curr = iter(curr);
		if (last === curr) {
			repeat++;
		}

		if (findFirstCorrupt(curr).length) {
			found = true;
		}
	}
	return curr;
}

const findCompletionString = (row) => {


	let bob = 0;

	let curr = row;

	let toAdd = [];

	// while (bob++ < 100 && curr.length) {
	// 	// curr = '';
	// }
	console.log(row);
	curr = consolidate(curr);
	console.log(curr);

	const m = {
		'{': '}',
		'[': ']',
		'<': '>',
		'(': ')'
	};

	return curr.split('').map(c => {
		
		const ch = m[c];
		
		return ch;
	}).reverse().join('');


	return '}}]])})';
}

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
