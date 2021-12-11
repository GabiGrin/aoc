// import { puzzleInput } from "../lib/lib";
import {assert} from 'chai';
import { access } from 'fs';
import { visitEachChild } from 'typescript';
import { getTestCases } from '../runtime/lib/get-tests';
import { readInputFile } from '../runtime/lib/input-output-files';
import { bottom, left, reduceMatrix, right, top, setCell, id, entries, fromId, getCell, simpleAdd, values } from './utils';

const parseInput = (raw: string) => {
	const rows = raw
		.split('\n')
		.map(n => n.trim())
		.filter((v) => !!v)
		.map(r => r.split('').map(Number));

	const grid = rows.reduce((grid, row, y) => {
			return row.reduce((grid, cell, x) => {
				return setCell({x, y}, cell, grid)
			},grid);
		}, new Map());

	const height = rows.length;
	const width = rows[0].length;
	return {width, height, grid};
	
}

export const solve = (raw: string): any => {
	const {grid, width, height} = parseInput(raw);

	const neighs = [left, top, right, bottom];

	const isValid = ({x, y}) => {
		return (x >= 0 && x < width) && (y >= 0 && y < height);
	}

	const lowPoints = entries(grid).reduce((acc, [id, currVal]) => {
		const pos = fromId(id);
		const neigh = neighs
			.map(fn => fn(pos))
			.filter(p => isValid(p))
			.map(p => getCell(p, grid));

		const valid = neigh.every(c => c >= currVal && currVal !== 9)

		return valid ? [...acc, pos] : acc;
	}, []);

	const getBasin = (currPos, visited) => {
		const curr = getCell(currPos, grid);

		if (visited.has(id(currPos))) {
			return [];
		}

		visited.add(id(currPos));

		const candidates = neighs
			.map(f => f(currPos))
			.filter(p => isValid(p))
			.filter(p => !visited.has(id(p)))
			.filter(p =>  getCell(p, grid) !== 9)
			.filter(p => {
				const v = getCell(p, grid);
				return  v > curr;
			});
	

		return candidates.reduce((acc, pos) => {
			const child = getBasin(pos, visited);
			return [...acc, ...child];
		}, [currPos]);
	}
	
	const basins = lowPoints.map(v => getBasin(v, new Set()));

	const sizes = basins.map( b => b.length);
	sizes.sort((a, b) => b - a);

	const [first, second, third] = sizes;
	
	const r = first * second * third;

	return r;
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

	it.only('passes input if exists', () => {
		const input = readInputFile();
		
		const actual = solve(input);
		console.log({actual}); //964712
		assert.notEqual(actual, 414120);
		assert.notEqual(actual, 1044111);
		assert.notEqual(actual, 1150464);
	});
})
