// import { puzzleInput } from "../lib/lib";
import {assert} from 'chai';
import { getTestCases } from '../runtime/lib/get-tests';
import { readInputFile } from '../runtime/lib/input-output-files';
import { createGrid, manDis, Vector } from './utils';

const parseInput = (raw: string) => {
	const rows = raw
		.split('\n')
		.map(n => n.trim())
		.filter((v) => !!v)
		.map(r => {
			const [p1, p2] = r.split(':')
			// console.log(p1, p2);
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

export const solve = (raw: string, max = 4000000): any => {
	const input = parseInput(raw);

	const mul = 4000000;

	const strengths = input.map(({s, b}) => {
		const distance = manDis(s, b);
		return {s, b, d: distance};
	})

	const calc = (curr: Vector, s: Vector, distance: number) => {
		const delta = manDis(curr, s);
		return delta - distance;
	}

	const findBestCandidate = (fromX, toX, fromY, toY, scale: number) => {

		let max = -Infinity;
		let pos = null;

		
		for (let x = fromX; x < toX; x+= scale) {
			for (let y = fromY; y < toY; y+=scale) {
				const p = {x, y};
				const s1 = strengths.map((i) => calc(p, i.s, i.d));
				const mn = Math.min(...s1);

			
				if (max < mn) {
					max = mn;
					pos = p
				}
			}

		}
		// console.log(max, pos);
		
		return {pos,  cand: max};
	}

	// let scale = 1000;
	// let fromX = 0, fromY = 0, toX = max, toY = max;

	// done 3900000 so far { x: 2517200, y: 3178000 } -2

	let scale = 1;
	let fromX = 2517200 - 10000, toX = 2517200 + 10000, fromY = 3178000 - 10000, toY = 3178000 + 10000;

	// while (scale > 0.1) {


		const {cand, pos} = findBestCandidate(fromX, toX, fromY, toY, scale);


		console.log({fromX, fromY, toX, toY, scale, cand, pos});
		
		
		// fromX = pos.x;
		// toX = Math.min(pos.x + scale, max);
		
		// fromY = pos.y
		// toY = Math.min(max, pos.y + scale);


		
		// // const largestDelta = Math.max(toX - fromX, toY- fromY);
		// scale = scale / 10;
				
		// if (cand > 0) {			
		// 	return (pos.x * mul) + pos.y;
		// }

	// }

};

// for wallaby
describe('part 1 tests', () => {
	it('passes for case 1 if exists', () => {
		const case1 = getTestCases()[0];
		if (case1) {
			const actual = solve(case1.input, 20);			
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

	it.only('passes input if exists', () => {
		const input = readInputFile();
		
		
		const actual = solve(input);
		assert.equal(actual ,4242)
		// console.log({actual});
	});
})
