// import { puzzleInput } from "../lib/lib";
import {assert} from 'chai';
import { EndOfLineState, setOriginalNode } from 'typescript';
import { getTestCases } from '../runtime/lib/get-tests';
import { readInputFile } from '../runtime/lib/input-output-files';
import { dis, getCell, manDis, range, setCell, values, vectorAdd, vectorDiv, vectorsDis, vectorSub } from './utils';

const parseInput = (raw: string) => {
	const rows = raw
		.split('\n')
		.map(n => n.trim())
		.filter((v) => !!v)
		.map(v => {
			const [, x1, y1, x2, y2] = v.match(/(\d+),(\d+)\s+->\s(\d+),(\d+)/).map(Number);
			return {l1: {x: x1, y: y1}, l2: {x: x2, y: y2}};
		});
		

	return rows;
}

export const solve = (raw: string): any => {
	const input = parseInput(raw);

	const grid = input.reduce((acc, {l1, l2}) => {
		const deltaLines = vectorSub(l2, l1);
		const dis = manDis(deltaLines);
		const sx = Math.ceil(deltaLines.x / dis);
		const sy = Math.ceil(deltaLines.y / dis);

		return range(dis + 1).reduce((acc2, i) => {
			const step = {x: i * sx, y: i * sy};
			const {x, y} = vectorAdd(l1, step);
			const curr = getCell({x, y}, acc2) || 0;
			return setCell({x, y}, curr + 1, acc2);
		}, acc);
	}, new Map());

	return values(grid).filter(v => v > 1).length;
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
