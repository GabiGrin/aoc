// import { puzzleInput } from "../lib/lib";
import {assert} from 'chai';
import { getTestCases } from '../runtime/lib/get-tests';
import { readInputFile } from '../runtime/lib/input-output-files';
import { createGrid, Grid, range } from './utils';
import { simpleAdd } from './utils/math';
import { ocrGrid } from './utils/to-image';

const nocr = require('nocr');

const parseInput = (raw: string) => {
	const [first, second ]= raw
		.split('\n\n');

	const paper = first.split('\n').map(r => {
		const [x, y] = r.split(',').map(Number);
		return {x, y};
	}).reduce((grid, pos) => {
		grid.set(pos, 1);
		return grid;
	}, createGrid());

	const instructions = second.split('\n').map(s => {
		const [, cord, val] = s.match(/along (x|y)=(\d+)/);
		return {cord, val: Number(val)};
	});

	return {paper, instructions};
}

export const solve = async (raw: string)  => {
	const {paper, instructions} = parseInput(raw);

	const fold = (currPaper: Grid<any>, foldPos: number, cord: 'x' | 'y') => {
		return currPaper.reduce((newPaper, val, pos) => {
			const relevantCord = cord === 'x' ? pos.x : pos.y;
			const afterFold = relevantCord > foldPos;

			if (afterFold ) {
				const diff = relevantCord - foldPos;
				const targetPos = cord === 'x' ? {x: foldPos - diff, y: pos.y} : {x: pos.x, y: foldPos - diff};				
				newPaper.set(targetPos, val);
				return newPaper;
			} else {
				newPaper.set(pos, val);
				return newPaper;
			}
		}, createGrid());
	}

	const finalPaper = instructions.reduce((paper, ins) => {
		const next = fold(paper, ins.val, ins.cord as any);
		return next;
	}, paper);

	console.log(finalPaper.toString());

	// const data = await ocrGrid(finalPaper.scale(5).pad(10, 0));
	// return data;

	// return finalPaper.reduce((acc, val) => acc + 1, 0);
};

// for wallaby
describe('part 1 tests', () => {
	it('passes for case 1 if exists', async () => {
		const case1 = getTestCases()[0];
		if (case1) {
			const actual = await solve(case1.input);			
			// assert.equal(actual, case1.expected);
		} else {
			// no test case
		}
	});

	// it('passes for case 2 if exists', () => {
	// 	const case2 = getTestCases()[1];
	// 	if (case2) {
	// 		const actual = solve(case2.input);
	// 		assert.equal(actual, case2.expected);
	// 	} else {
	// 		// no test case
	// 	}
	// });

	// it('passes for case 3 if exists', () => {
	// 	const case3 = getTestCases()[2];
	// 	if (case3) {
	// 		const actual = solve(case3.input);
	// 		assert.equal(actual, case3.expected);
	// 	} else {
	// 		// no test case
	// 	}
	// });

	// it('passes for case 4 if exists', () => {
	// 	const case4 = getTestCases()[3];
	// 	if (case4) {
	// 		const actual = solve(case4.input);
	// 		assert.equal(actual, case4.expected);
	// 	} else {
	// 		// no test case
	// 	}
	// });

	// it('passes for case 5 if exists', () => {
	// 	const case5 = getTestCases()[4];
	// 	if (case5) {
	// 		const actual = solve(case5.input);
	// 		assert.equal(actual, case5.expected);
	// 	} else {
	// 		// no test case
	// 	}
	// });

	// it('passes input if exists', () => {
	// 	// const input = readInputFile();
		
		
	// 	// const actual = solve(input);
	// 	// console.log({actual});
	// });
})
function rawImageData(finalPaper: Grid<unknown>) {
	throw new Error('Function not implemented.');
}

