// import { puzzleInput } from "../lib/lib";
import {assert} from 'chai';
import { getFixtures } from '../lib';

const parseInput1 = (raw: string) => {
	const rows = raw
		.split('\n')
		.map(n => n.trim())
		.filter((v) => !!v);

	return rows;
}

export const solve1 = (raw: string): any => {
	const input = parseInput1(raw);

	const count = (word, n) => {
		const bobs = word.split('').reduce((acc, curr) => {
			const c = (acc[curr] || 0) + 1;
			return {...acc, [curr]: c};
		}, {});

		return !!Object.entries(bobs).find(pair => n === pair[1]);
	}

	const twos = input.filter(i => count(i, 2)).length;
	const threes = input.filter(i => count(i, 3)).length;
	
	return twos * threes;
};

// for wallaby
describe('part 1 tests', () => {
	it('passes for case 1 if exists', () => {
		const case1 = getFixtures(1)[0];
		if (case1) {
			const actual = solve1(case1.input);			
			assert.equal(actual, case1.expected);
		} else {
			// no test case
		}
	});

	it('passes for case 2 if exists', () => {
		const case2 = getFixtures(1)[1];
		if (case2) {
			const actual = solve1(case2.input);
			assert.equal(actual, case2.expected);
		} else {
			// no test case
		}
	});

	it('passes for case 3 if exists', () => {
		const case3 = getFixtures(1)[2];
		if (case3) {
			const actual = solve1(case3.input);
			assert.equal(actual, case3.expected);
		} else {
			// no test case
		}
	});

	it('passes for case 4 if exists', () => {
		const case4 = getFixtures(1)[3];
		if (case4) {
			const actual = solve1(case4.input);
			assert.equal(actual, case4.expected);
		} else {
			// no test case
		}
	});

	it('passes for case 5 if exists', () => {
		const case5 = getFixtures(1)[4];
		if (case5) {
			const actual = solve1(case5.input);
			assert.equal(actual, case5.expected);
		} else {
			// no test case
		}
	});
})
