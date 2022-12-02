// import { puzzleInput } from "../lib/lib";
import {assert} from 'chai';
import { getTestCases } from '../runtime/lib/get-tests';
import { readInputFile } from '../runtime/lib/input-output-files';
import { calcNeighbours, createGrid, Grid, gridFromMatix, vectorAdd } from './utils';

const parseInput = (raw: string) => {
	const rows = raw
		.split('\n')
		.map(n => n.split(''))
		// .map(Number);
		// .map(v => v.split('').map(Number));

	return gridFromMatix(rows);
}

export const solve = (raw: string): any => {
	const initGrid = parseInput(raw);

	const w = initGrid.width();
	const h = initGrid.height();

	console.log({w, h});
	

	const step = (grid: Grid<any>) => {
		let moved = false;

		const afterEast = grid.reduce((acc, val, pos, self) => {

			if (val !== '>')  {
				return acc;
			}

			let next = vectorAdd(pos, {x: 1, y: 0});
			if (next.x >= w) {
				next.x = 0;
			}

			if (self.get(next) === '.')  {	
				moved= true;			
				acc.set(next, val)
				acc.set(pos, '.');
			} else {
				acc.set(pos, val);
			}
			
			return acc;

		}, grid.copy());

		const afterSouth = afterEast.reduce((acc, val, pos, self) => {

			if (val !== 'v')  {
				return acc;
			}

			let next = vectorAdd(pos, {x: 0, y: 1});
			if (next.y >= h) {
				next.y = 0;
			}
			
			if (self.get(next) === '.')  {				
				moved= true;
				acc.set(next, val)
				acc.set(pos, '.');
			} else {
				acc.set(pos, val);
			}
			
			return acc;

		}, afterEast.copy())


		// console.log(grid.print());

		// console.log(('------------------'));
		// console.log(('---after east ----'));
		// console.log(('------------------'));
		
		// console.log(afterEast.print());

		// console.log(('------------------'));
		// console.log(('---after south ----'));
		// console.log(('------------------'));
		// // console.log(afterSouth.print());

		// console.log(afterSouth.print());
		return {moved, grid: afterSouth};
		

	}

	// let i = 0;
	// console.log(initGrid.print());
	
	// const {grid} = step(initGrid);
	// console.log(grid.print());
	// step(grid);
	
	let {grid, moved} = step(initGrid);
	let i = 0;
	// console.log(grid.print(), i);
	while (moved) {

		if ( i ==1) {
			// console.log(grid.print(), i);
		}
		const res= step(grid);
		moved = res.moved;
		if (moved) {
			i++
		}
		grid = res.grid;
		// console.log({i});
	}
	console.log(grid.toString());
	
	

	return i + 2;
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
		// const input = readInputFile();
		
		
		// const actual = solve(input);
		// console.log({actual});
	});
})
