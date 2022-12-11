// import { puzzleInput } from "../lib/lib";
import {assert} from 'chai';
import { getTestCases } from '../runtime/lib/get-tests';
import { readInputFile } from '../runtime/lib/input-output-files';

const parseInput = (raw: string) => {
	const rows = raw
		.split('\n\n')
		.map(r => {
			console.log(r);
			const [m, s, o, t, tr, fl] = r.split('\n');

			const num = Number(m.match(/\d+/)[0]);
			const items = s.replace('Starting items: ', '').split(', ').map(Number);
			const op = o.replace('Operation: new =', '');
			
			const div = Number(t.match(/\d+/)[0]);
			
			const fn = (old) => eval(op.replace('old', old).replace(/\d+/g, (n) => `Number(${n})`));
			const ifTrue = Number(tr.match(/\d+/)[0]);
			const ifFalse = Number(fl.match(/\d+/)[0]);

			return {
				num, items, div, fn, ifTrue, ifFalse
			}

		})
		// .map(Number);
		// .map(v => v.split('').map(Number));

	// return gridFromMatix(rows);
	return rows;
}

export const solve = (raw: string): any => {
	const input = parseInput(raw);

	let itemsPerMonkey = input.map(_ => 0);
	const calculateLCM = (...arr) => {
		const gcd2 = (a, b) => {
		   // Greatest common divisor of 2 integers
		   if(!b) return b===0 ? a : NaN;
			  return gcd2(b, a%b);
		};
		const lcm2 = (a, b) => {
		   // Least common multiple of 2 integers
		   return a * b / gcd2(a, b);
		}
		// Least common multiple of a list of integers
		let n = 1;
		for(let i = 0; i < arr.length; ++i){
		   n = lcm2(arr[i], n);
		}
		return n;
	 };

	const divs = input.map(i => i.div);

	const lcm = calculateLCM(...divs)
	
	
	for (let r = 0; r < 10000; r++) {
		// console.log('round ' + r);

		for (let monkey of input) {
			// console.log(monkey);
			// console.log(monkey.items);
			
			while (monkey.items.length) {
				const item = monkey.items.shift();
				const _newLevel = Number(monkey.fn(item));

				const newLevel = _newLevel % lcm;
				itemsPerMonkey[monkey.num] = itemsPerMonkey[monkey.num] + 1;

				if (newLevel % monkey.div === Number(0)) {
					input[monkey.ifTrue].items.push(newLevel);
				} else {
					input[monkey.ifFalse].items.push(newLevel);
				}
			}

		}
		
	}
	// console.log(itemsPerMonkey);
	const [f, s] = itemsPerMonkey.sort((a,b) => b -a)
	return f * s;
	
	
	
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
