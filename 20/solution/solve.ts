// import { puzzleInput } from "../lib/lib";
import {assert} from 'chai';
import { getTestCases } from '../runtime/lib/get-tests';
import { readInputFile } from '../runtime/lib/input-output-files';

const parseInput = (raw: string) => {
	const rows = raw
		.split('\n')
		.map(n => n.trim())
		.filter((v) => !!v)
		.map(v => Number(v));
		// .map(v => v.split('').map(Number));

	// return gridFromMatix(rows);
	return rows;
}


export const solve = (raw: string): any => {
	const input = parseInput(raw);

	const map = new Map();
	const ENKEY =  811589153;
	const first = {val: input[0], left: null, right: null, ev: input[0] * ENKEY};
	map.set(first, input[0]);


	let zero;
	const ordered = [first];

	let last = first;
	for (let i = 1; i < input.length; i++) {
		const v = input[i];
		// console.log(last.val);
		const node = {val: v, ev: v * ENKEY, left: last, right: null}
		map.set(v, node)
		last.right = node;
		last = node;
		if (v === 0) {
			zero = node;
		}
		ordered.push(node);
	}
	last.right = first;
	first.left = last;

	

	const swapN = (node, N) => {

		// console.log(print(), node.val)
		if (N > 0) {
			for (let i = 0 ;i < N; i++) {
				// 0 <-> [1] <-> 2 <->  3
				let right = node.right;
				let rightright = right.right;
				let left = node.left;

				
				left.right = right;
				right.left = left;


				right.right = node;
				node.right = rightright;
				node.left = right;
				rightright.left = node;
			}
		} else {
			for (let i = 0 ;i < Math.abs(N); i++) {
				// 0 <-> 1 <-> [2] <->  3
				let left  = node.left;
				let leftleft = left.left;
				let right = node.right;
				//
				right.left = left;
				left.right = right;

				node.left = leftleft
				leftleft.right = node;
				node.right = left;
				left.left = node;
			}
		}
	}

	const print = () => {
		let curr = first;
		const v = [];
		let start = false;
		while (curr !== first || !start) {
			v.push(curr.ev);
			curr = curr.right;
			start=true;
		}
		return v.join(',')
	}
	
	// swapN(first, first.val)

	for (let t = 0; t < 10; t++ ){
		for (let node of ordered) {
	
			
			let n = node.ev % (ordered.length - 1);
			// if (node.ev < 0) n = n * -1;

			console.log(n);
			
			// console.log(print());
			
			swapN(node, n);
			// console.log(print());
			// break;
		}
		console.log('BOB', print());
		// break;
	}

    

	


	let vals = 0;

	let curr = zero;
	for (let i =0 ; i < 3000;i++) {
		curr = curr.right;
		if (i === 999 || i === 1999 || i === 2999) {
			console.log(curr.ev);
			
			vals+=curr.ev;
		}
	}
	return vals;

	
	
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
