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


const getCount2 = (input, targetY) => {
	const grid = createGrid();

	input.forEach((item) => {
		const {s, b} = item;
		grid.set(s, 'S');
		grid.set(b, 'B');

		const distance = manDis(s, b);

		const distanceFromTarget = manDis(s, {x: s.x, y: targetY})
		const extra = distance - distanceFromTarget;

		for (let d = 0; d <= extra; d++) {
			const p1 = {x: s.x + d, y: targetY};
			const p2 = {x: s.x - d, y: targetY};
			const v1 = grid.get(p1)
			const v2 = grid.get(p2)
			if (!v1) {
				grid.set(p1, '#');
			}

			if (!v2) {
				grid.set(p2, '#');
			}
		}
	});
		
	return grid.reduce((curr, val, pos) => {
		return pos.y === targetY && val === '#' ? curr + 1 : curr;
	}, 0);
}

const getCount = (input, targetY) => {
	

	const set = new Set();
	const becons = new Set();

	const inRange = x => x >= 0 && x <= 4000000;

	input.forEach((item) => {
		if (item.b.y === targetY && inRange(item.b.x)) {
			becons.add(item.b.x);
		}

		if (item.s.y === targetY && inRange(item.s.x)) {
			set.add(item.s.x);
		}
	})

	input.forEach((item) => {
		const {s, b} = item;

		if (s.y === targetY) {
			set.add(s.x)
		}

		const distance = manDis(s, b);

		const distanceFromTarget = manDis(s, {x: s.x, y: targetY})
		const extra = distance - distanceFromTarget;

		for (let d = 0; d <= extra; d++) {
			const p1 = {x: s.x + d, y: targetY};
			const p2 = {x: s.x - d, y: targetY};

			if (inRange(p1.x)) {
				if (!becons.has(p1.x)) {
					set.add(p1.x)
				}
			} 

			if (inRange(p2.x)) {
				if (!becons.has(p2.x)) {
					set.add(p2.x)
				}
			}
		}	
	});

	return {set, becons}
}


const calc = (curr: Vector, s: Vector, distance: number) => {
	const delta = manDis(curr, s);
	return delta - distance;
}

export const solve = (raw: string, max = 4000000): any => {
	const input = parseInput(raw);

	const findBestCandidate = (fromX, toX, fromY, toY, scale: number) => {

		let max = -Infinity;
		let pos = null;

		const strengths = input.map(({s, b}) => {
			const distance = manDis(s, b);
			return {s, b, d: distance};
		})
	
		
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

	const mul = 4000000;


	const scale = max / 10;

	const values = [];

	// console.log(getCount(input, 10));

	// return getCount(input, max);
	

	for (let dy = 0; dy <= max/2; dy++) {

		const y1 = max/2 - dy;
		const y2 = max/2 + dy;

		const get = (y) => {
			const {set, becons} = getCount(input, y);
			return set;
		}

		const v1 = get(y1);
		const v2 = get(y2);

		console.log('tried', y1, y2);
		

		const f = (set) => {
			for (let x = 0; x < max; x++) {
				if (!set.has(x)) {
					return x;
				}
			}
		}

		if (v1.size < max) {
			console.log(v1.size, y1);
			console.log({x: f(v1)});
			

			return f(v1) * max + y1;
		}

		if (v2.size < max) {
			console.log({x: f(v2)});
			console.log(v2.size, y2);
			return f(v2) * max + y2;
		}

		
	}

	// values.sort((v1, v2) => v2.val - v1.val)

	// console.log(values);
	
	

};

// for wallaby
describe('part 1 tests', () => {
	it.only('passes for case 1 if exists', () => {
		const case1 = getTestCases()[0];
		if (case1) {
			const actual = solve(case1.input, 20);			
			assert.equal(actual, 26);
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
		const input = readInputFile();
		
		
		const actual = solve(input);
		assert.equal(actual ,4242)
		// console.log({actual});
	});
})
