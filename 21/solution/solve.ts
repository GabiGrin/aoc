// import { puzzleInput } from "../lib/lib";
import {assert} from 'chai';
import { getTestCases } from '../runtime/lib/get-tests';
import { readInputFile } from '../runtime/lib/input-output-files';
import { range } from './utils';
import { simpleAdd } from './utils/math';

const parseInput = (raw: string) => {
	const rows = raw
		.split('\n')
		.map(n => n.match(/on: (\d+)/)[1])
		.map(Number);
		// .map(v => v.split('').map(Number));

	// return gridFromMatix(rows);
	return rows;
}


export const solve = (raw: string): any => {
	let [p1, p2] = parseInput(raw);

	const perms = `111
112
113
121
122
123
131
132
133
211
212
213
221
222
223
231
232
233
311
312
313
321
322
323
331
332
333`.split('\n').map(r => {
	const ns = r.split('').map(Number);
	const sum = ns.reduce(simpleAdd);
	return sum;
}).sort();

// console.log(perms);

const occ = perms.reduce((map, count) => {
	const c = map.get(count) || 0;
	return map.set(count, c + 1);
}, new Map())


	const opts = [3,4,5,6,7,8,9];

	const round = (pos) =>{
		return ((pos - 1) % 10) + 1;
	}

	const getNext = ({p1, p2, s1, s2, turn, count}) => {

		if (turn === '1') {

			const nextMoves = opts.map(diceSum => {
				const np1 = round(p1 + diceSum);
				const ns1 = s1 + np1;
				const newCount = count * occ.get(diceSum);

				return {p1: np1, p2, s1: ns1, s2, count: newCount, turn: '2'};
			})
			return nextMoves;
		} else {
			const nextMoves = opts.map(diceSum => {
				const np2 = round(p2 + diceSum);
				const ns2 = s2 + np2;
				const newCount = count * occ.get(diceSum);

				return {p1, p2: np2, s1, s2: ns2, count: newCount, turn: '1'};
			})
			return nextMoves;
		}
		
	}


	const moves = [{p1, p2, s1: 0, s2: 0, count: 1, turn: '1'}];

	console.log(moves);
	

	let s1w = 0;
	let s2w = 0;

	let steps = 0;

	const MAX_SCORE = 21;

	while (moves.length) {
	
		const next = moves.pop();

		// console.log(next);
		
		if (next.s1 >= MAX_SCORE) {
		
			// console.log(steps, next);
			
			s1w+= next.count;
			// console.log(s1w);
		} else if (next.s2 >= MAX_SCORE) {
			// console.log(steps, next);
			s2w+= next.count;
			// console.log(s2w);

		} else {

			const nextMoves = getNext(next);
			// console.log(nextMoves);
			
			moves.push(...nextMoves);
		}

		if (steps++ % 100000000 === 0) {
			console.log({steps, count: next.count});
			
		}


	}
	console.log({s1w, s2w});
	
	return Math.max(s1w, s2w);

	
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
