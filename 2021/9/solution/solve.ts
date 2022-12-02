// import { puzzleInput } from "../lib/lib";
import {assert} from 'chai';
import { validateLocaleAndSetLanguage } from 'typescript';
import { getTestCases } from '../runtime/lib/get-tests';
import { readInputFile } from '../runtime/lib/input-output-files';
import { calcNeighbours, gridFromMatix, id, Vector, vectorEquals } from './utils';

const parseInput = (raw: string) => {
	const rows = raw
		.split('\n')
		.map(n => n.trim())
		.filter((v) => !!v)
		// .map(Number);
		.map(v => v.split('').map(Number));

	return gridFromMatix(rows);
}

export const solve = (raw: string): any => {
	const grid = parseInput(raw);
	const lowPoints = grid.reduce((acc, v, p) => {
		const low = calcNeighbours(p).every(n => {
			const nv = grid.get(n, 9);
			return v < nv;
		})
		return low ? [...acc, p] : acc; 
	}, []);

	const getBasin = (p: Vector, vis: Set<any>): Vector[] => {
		// const val = grid.get(p);
		if (vis.has(id(p))) {
			return [];
		}
		vis.add(id(p));

		const toVisit = calcNeighbours(p).filter((np) => {
			const nv = grid.get(np, 9);
			return nv !== 9 && !vis.has(id(np));
		});

		return [...toVisit.reduce((acc, vp) => {
			const bas = getBasin(vp, vis);
			return [...acc, ...bas];
		}, [p])];
	}

	const basins = lowPoints.map(lp => getBasin(lp, new Set()));
	const sizes = basins.map(b => b.length);
	const sorted = sizes.sort((a,b) => b - a);
	
	const [first, second, third] = sorted;

	return first * second * third;
};

// for wallaby
describe('part 1 tests', () => {
	it.only('passes for case 1 if exists', () => {
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
		const input = readInputFile();
		
		
		const actual = solve(input);
		assert.notEqual(actual, '1035500')
		// console.log({actual});
	});
})
