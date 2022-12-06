// import { puzzleInput } from "../lib/lib";
import {assert} from 'chai';
import { getTestCases } from '../runtime/lib/get-tests';
import { readInputFile } from '../runtime/lib/input-output-files';
import { range } from './utils';

const parseInput = (raw: string) => {
	const rows = raw

	const [rawStack, movesRaw] = raw.split('\n\n');

	console.log(movesRaw);


	const moves = movesRaw.split('\n').map(row => {
		const [, count, source, target] = row.match(/move (\d+) from (\d+) to (\d+)/).map(Number);
		return {count, source, target}
	});


	const srows = rawStack.split('\n');
	const lastRow = srows[srows.length - 1];
	const stacksRow = lastRow.trim().split(/\s+/).map(Number);
	const stackCount = stacksRow.reverse()[0]

	const stacks = [];

	for (let i = 0; i < stackCount; i++) {
		console.log(srows.length - 1);
		
		for (let l = 0; l < srows.length -1; l++) {
			
			const char = srows[l].charAt(i * 4 + 1);
			
			if (char && char !== ' ') {
				const s = stacks[i] || [];
				s.unshift(char);
				stacks[i] = s;
			}
			
		}
		
	}

	
	return {moves, stacks}
	
	
	
	// for (i = 0; )
	

	// const stacks = rawStack.reduce((all, currRow) => {
	// 	const chars = currRow.split('');
	// 	const list = 
	// })

	// console.log(match);
	
	
		
		// .map(Number);
		// .map(v => v.split('').map(Number));

	// return gridFromMatix(rows);
	// return rows;
}

export const solve = (raw: string): any => {
	const input = parseInput(raw);


	const {stacks, moves} = input;

	for (let m of moves) {
		const {count, source, target} = m;

		const temp = [];
		for (let m = 0; m < count; m++) {
			const item = stacks[source - 1].pop();
			temp.push(item);
		}
		temp.reverse().forEach(item => {
			stacks[target - 1].push(item);
			
		})
	}

	const msg = stacks.map(s => s.pop()).join('');

	console.log(msg);
	return msg;
	

	

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
