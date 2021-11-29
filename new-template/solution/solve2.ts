// import { puzzleInput } from "../lib/lib";
import {assert} from 'chai';
import { getFixtures } from '../lib';

const parseInput1 = (raw: string) => {
	const rows = raw
		.split('\n')
		.map(n => n.trim())
		.filter((v) => !!v)
		.map(Number);

	return rows;
}

export const solve2 = (raw: string): any => {
	const input = parseInput1(raw);

	const reached = new Set();
	
	let total = 0;
	reached.add(total);

	let i = 0;

	while (true) {
		const n = input[i % input.length];
		total += n;
		
		if (reached.has(total)) {
			return total;
		} else {
			console.log(total);
			
			reached.add(total);
		}
		i++;
	}
};

// for wallaby
describe('part 1 tests', () => {
	it('passes for case 1 if exists', () => {
		const case1 = getFixtures(2)[0];
		if (case1) {
			const actual = solve2(case1.input);			
			assert.equal(actual, case1.expected);
		} else {
			// no test case
		}
	});

	it('passes for case 2 if exists', () => {
		const case2 = getFixtures(2)[1];
		if (case2) {
			const actual = solve2(case2.input);
			assert.equal(actual, case2.expected);
		} else {
			// no test case
		}
	});

	it('passes for case 3 if exists', () => {
		const case3 = getFixtures(2)[2];
		if (case3) {
			const actual = solve2(case3.input);
			assert.equal(actual, case3.expected);
		} else {
			// no test case
		}
	});

	it('passes for case 4 if exists', () => {
		const case4 = getFixtures(2)[3];
		if (case4) {
			const actual = solve2(case4.input);
			assert.equal(actual, case4.expected);
		} else {
			// no test case
		}
	});

	it('passes for case 5 if exists', () => {
		const case5 = getFixtures(2)[4];
		if (case5) {
			const actual = solve2(case5.input);
			assert.equal(actual, case5.expected);
		} else {
			// no test case
		}
	});
})
