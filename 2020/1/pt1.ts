import { puzzleInput } from "./puzzle-input";
import {assert} from 'chai';

const toNums = str => str.map(Number);

export const solve = (input: string): any => {
	const n = toNums(input.split('\n').map(n => n.trim()).filter((v) => !!v));

	n.sort();

	// for (let i = 0; i< n.length; i++) {
	// 	for (let j = n.length - 1; j>=0; j--) {
	// 		if (i === j) {
	// 			break;
	// 		}
	// 		if (i !== j) {
	// 			const a = n[i] ;
	// 			const b = n[j] ;
	// 			if(a + b === 2020) {
	// 				console.log(a, b);
	// 				return a  * b;
	// 			}
	// 		}
	// 	}
	// }

	for (let i = 0; i< n.length; i++) {
		for (let j = i + 1; j< n. length; j++) {
			for (let k = j + 2; k< n.length; k++) {
			if (i !== j && k !== j) {
				const a = n[i] ;
				const b = n[j] ;
				const c = n[k] ;
				if(a + b + c === 2020) {
					console.log(a, b);
					return a  * b * c;
				}
			}
			}
		}
	}
	return n;
};

describe('bob', () => {	
	it('works for test case 1', () => {
		const input = `1721
		979
		366
		299
		675
		1456`;

		assert.equal(solve(input), 241861950);
	});

	// it('works for test case 2', () => {
	// 	const input = `HERE`;

	// 	assert.equal(solve(input), 424242);
	// });

	// it('works for test case 3', () => {
	// 	const input = `HERE`;

	// 	assert.equal(solve(input), 424242);
	// });

	it('show the answer when ready!', () => {

		// const expected = 42;

		assert.equal(solve(puzzleInput), 'bob');
	});
});

