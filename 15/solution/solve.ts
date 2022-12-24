// import { puzzleInput } from "../lib/lib";
import {assert} from 'chai';
import { posix } from 'path';
import { getTestCases } from '../runtime/lib/get-tests';
import { readInputFile } from '../runtime/lib/input-output-files';
import { calc, calcBorders, findBestCandidate } from './lib';
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


	const circles = input.map(({s, b}) => {
		return {center: s, size: manDis(s, b), ol: []};
	})

	circles.forEach(c1 => {

		circles.forEach((c2) => {
			if (c1 !== c2) {

				const disCenter = manDis(c1.center, c2.center);
				const overlaps = disCenter < (c1.size + c2.size);
				if (overlaps) {
					// if (!c2.ol.includes(c1)) {
						c1.ol.push(c2);
					// } else {
					// 	console.log('s2');
						
					// }
				} 
			} else {
				// console.log('s1');
				
			}
		}) 
	})
	
	const strengths = input.map(({s, b}) => {
		const distance = manDis(s, b);
		return {s, b, d: distance};
	})
	const borders = calcBorders(input, mul);

	let mx = -Infinity

	let lastPos;
	borders.forEach((border, i) => {

		border.bs.forEach((pos) => {
			const s = strengths.map((i) => calc(pos, i.s, i.d));
			const mn = Math.min(...s);
			if (mx < mn) {
				mx = mn;
				console.log('found new', mx, pos);
				if (mn === 1) {
					lastPos = pos;
					console.log('ANSWER', pos.x * mul + pos.y)
					// return pos.x * mul + pos.y;
				}
			}

		})
		console.log('done ', i);
		
	})

	
	

	return 42;

	
};

// for wallaby
describe('part 1 tests', () => {
	it.only('passes for case 1 if exists', () => {
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
