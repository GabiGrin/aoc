// import { puzzleInput } from "../lib/lib";
import {assert} from 'chai';
import { getTestCases } from '../runtime/lib/get-tests';
import { readInputFile } from '../runtime/lib/input-output-files';

const parseInput = (raw: string) => {
	const rows = raw
		.replace(/\n\n/g, '\n').split('\n')
		.map(n => n.trim())
		.filter((v) => !!v)
		.map(r => {
	

			const parse = (arr: string) => {


				const root = [];
				// let parent = null;
				let curr = {list: root, parent: null};


				const chars = arr.split('');

				let num = '';

				while (chars.length) {
					const next = chars.shift();

					if (next === '[') {
						// parent = curr;
						let r = curr;
						curr = {list: [], parent: r}
						console.log(curr);
						
					} else if (next === ']') {
						curr.parent.list.push(curr.list)
						// parent.push(curr);
						curr = curr.parent;
					} else if (next === ',') {
						//
					} else {

						let num = next;
						while (chars[0].match(/\d/)) {
							num = num + chars.shift();
							// console.log(num);
							
						}
						const n = Number(num);

						

						curr.list.push(n);
					}
				}
				// console.log(arr, root);
				
				return root;


			}
			
			return parse(r);
		})
		// .map(Number);
		// .map(v => v.split('').map(Number));

	// return gridFromMatix(rows);
	return rows;
}

export const solve = (raw: string): any => {
	const input = parseInput(raw);


	input.push([[2]], [[6]]);
	// console.log(input);
	

	// const rightOrder = (a, b) => {

	// 	if (a.length === 0 && b.length === 0) {
	// 		return 'noop';
	// 		// return rightOrder(a,b);
	// 	} else if (a.length ===0) {
	// 		return true;
	// 	} else if (b.length ===0 ) {
	// 		return false;
	// 	}

	// 	const left = a.shift();
	// 	const right = b.shift();
	// 	if (typeof left === 'undefined' && typeof right !== 'undefined') {
	// 		throw new Error('wat')
	// 		return true;
	// 	} else if (typeof left !== 'undefined' && typeof right === 'undefined') {
	// 		throw new Error('wat')
	// 	}  else  if (typeof left === 'number' && typeof right === 'number') {
	// 		if (left < right) {
	// 			return true;
	// 		} else if (left > right) {
	// 			return false;
	// 		} else {
	// 			// equal
	// 			return 'noop';
	// 		}
	// 	} else {

	// 		const left2 = typeof left === 'number' ? [left] : left;
	// 		const right2 = typeof right === 'number' ? [right] : right;
	// 		return rightOrder(left2, right2);
	// 	}
	// 	// console.log(left, right);

		
		
		
	// 	return false;
	// }

	const rightOrder = (a, b) => {


		while (a.length) {
			if (b.length === 0) {
				return false;
			}

			const ca = a.shift();
			const cb = b.shift();

			if (typeof ca === 'number' && typeof cb === 'number') {
				// console.log(ca, cb);
				
				if (ca > cb) {
					return false;
				} else if (cb > ca) {
					console.log(ca, cb);
					
					return true;
				} else {
					// console.log('same', ca, cb);
					
				}
			} else {
				const na = typeof ca === 'number' ? [ca] : ca;
				const nb = typeof cb === 'number' ? [cb] : cb;

				const res = rightOrder([...na], [...nb]);

				if (res === true || res === false) {
					return res;
				}
			}
			
		}
		if (b.length > a.length) {
			return true;
		} else if (a.length > b.length) {
			return false;
		}
		
		// return true;
	}
	

	input.sort((a, b) => {
		const r = rightOrder([...a], [...b]);
		if (r===true) {
			return -1;
		} else if (r === false) {
			return 1
		} else {
			return 0;
		}
	})

	console.log(input, 42);
	

	const idx1 = input.findIndex(item => JSON.stringify(item) === JSON.stringify([[2]])) + 1;
	const idx2 = input.findIndex(item => JSON.stringify(item) === JSON.stringify([[6]]))+ 1;

	return idx1 * idx2;
	

	// const r = rightOrder(...input[1]);
	// console.log(r);
	// return 2;
	

	

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
