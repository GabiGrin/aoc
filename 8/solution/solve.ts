// import { puzzleInput } from "../lib/lib";
import {assert} from 'chai';
import { from } from 'form-data';
import { getTestCases } from '../runtime/lib/get-tests';
import { readInputFile } from '../runtime/lib/input-output-files';
import { gridFromMatix, isDefined, range, range2, Vector, vectorSub } from './utils';
import { simpleAdd, simpleMul, simpleSub } from './utils/math';



const parseInput = (raw: string) => {
	const rows = raw
		.split('\n')
		.map(n => n.trim())
		.filter((v) => !!v)
		.map(r => {
			return r.split('').map(Number);
		})
		// .map(Number);
		// .map(v => v.split('').map(Number));

	return gridFromMatix(rows);
	// return rows;
}

export const solve = (raw: string): any => {
	const input = parseInput(raw);

	console.log(input);


	const width = input.width();
	const height = input.width();


	const countTrees = (pos: Vector, to: Vector, db, val: number) => {

		let toPass = [];
		if (pos.y === to.y) {
			toPass = range2(pos.x, to.x, db)
			.map(x => ({x, y: pos.y}));
		} else {
			toPass = range2(pos.y, to.y, db)
			.map(y => ({y, x: pos.x}));
		}

		let c = 0;
		let br = false;
		toPass.forEach((p) => {
			const v = input.get(p);

			if (db) {
				console.log(c, v);
			}

			if (!br) {
				c++;
			}
			if (v >= val) {
				if (db) {
					console.log(val);
					
				}
				br = true;
			}
		})

		if (db) {
			console.log(toPass);
			console.log(c);
			
			// console.log(toPoss);
		}

			
		
		return c;

		
	}

	return input.reduce((count, val, pos, grid) => {


		const db = pos.x === 2 && pos.y === 3;
		

		const countTop = countTrees({...pos, y: pos.y}, {...pos, y: 0}, db, val);
		const countLeft = countTrees({...pos, x: pos.x}, {...pos, x: 0}, db, val);
		
		const countBottom = countTrees({...pos, y: pos.y +1}, {...pos, y: height}, db, val);
		const countRight = countTrees({...pos, x: pos.x + 1}, {...pos, x: width}, db, val);

		const counts = [countTop, countLeft, countBottom, countRight]
		const total = counts.reduce(simpleMul, 1);

		if (pos.x === 2 && pos.y === 3) {
			console.log(input.get(pos));
			
			console.log(counts);
			
			console.log(counts);
		}

		

		console.log(counts, total);
		
		return Math.max(count, total);
	}, 0)
	

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
