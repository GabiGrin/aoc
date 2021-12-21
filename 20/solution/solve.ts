// import { puzzleInput } from "../lib/lib";
import {assert} from 'chai';
import { runInContext } from 'vm';
import { getTestCases } from '../runtime/lib/get-tests';
import { readInputFile } from '../runtime/lib/input-output-files';
import { calcNeighboursWithDiag, top, gridFromMatix, left, right, topLeft, topRight, Vector, bottomLeft, bottom, bottomRight, Grid, createGrid, keys, fromId, range } from './utils';
import { fastMax, fastMin } from './utils/math';

const parseInput = (raw: string) => {
	const [algo, rawGrid] = raw
		.split('\n\n')
		
		// .map(Number);
		// .map(v => v.split('').map(Number));

	const grid = gridFromMatix(rawGrid.split('\n').map(s => s.split('')));
	



	return {algo, grid};
}

export const solve = (raw: string): any => {
	const {algo, grid} = parseInput(raw);

	const getAlgoNum = (v: Vector, g: Grid<any>, defaulValue) => {

		
		const poses =[topLeft, top, topRight, left, n => n, right, bottomLeft, bottom, bottomRight]
			.map(fn => fn(v));


		const values = poses.map(p => g.get(p, defaulValue));

		const isDefault = (values.every(v => v === '.'));

		if (isDefault) {
			// console.log('DEFAULT');
		}
		

		// const val = isDefault ? values.map(() => defaulValue) : values;

		const n = values
			.map(i => i === '#' ? 1 : 0).join('')
		
		
			// console.log(n);
		const num = parseInt(n, 2);
		return algo[num];
	}

	const run = (currGrid: Grid<any>, defaultValue: '#' | '.') => {

		const inner = currGrid.getInner();
		const ks = keys(inner).map(p => fromId(p));
		// console.log(ks);
		const xs = ks.map(v => v.x)
		const ys = ks.map(v => v.y)

		const minX = fastMin(xs);
		const maxX = fastMax(xs);

		const minY = fastMin(ys);
		const maxY = fastMax(ys);
		// const h =currGrid.height();

		const newGrid = createGrid();

		const size = 8

		for (let x = minX - size; x < maxX + size; x++){
			
			for (let y = minY - size; y < maxY + size; y++){

				const newPos = {x, y};
				// console.log(newPos);
				
				const pixel = getAlgoNum(newPos, currGrid, defaultValue);
				// console.log(pixel);
				
				newGrid.set(newPos, pixel)
			}
		}
		return newGrid;
	}

	const count = (g) => {
		return g.reduce((a, c) => {
			return c === '#' ? a + 1 : a;
		},0);
	}

	console.log(count(grid));
	

	// const bob = getAlgoNum({x: 2, y: 2});
	// console.log(bob);
	const newGrid = run(grid, '.')

	console.log(newGrid.toString());
	// console.log(count(newGrid));

	
	const another = run(newGrid, '#');

	// console.log(count(another));

	const  f = range(0, 50).reduce((currGrid, step) => {
		console.log(step);
		
		const def = step % 2 === 0 ? '.' : '#';
		return run(currGrid, def);
	}, grid) 


	// console.log(another.toString());
	return count(f);
	
	

	// return input.length;
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
