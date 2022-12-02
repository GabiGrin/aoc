// import { puzzleInput } from "../lib/lib";
import {assert} from 'chai';
import { validateLocaleAndSetLanguage } from 'typescript';
import { getTestCases } from '../runtime/lib/get-tests';
import { readInputFile } from '../runtime/lib/input-output-files';
import { calcZ, parseInput, run, singleDigit } from './lib';
import { calcNum } from './stuff/anon';
import { chunk, isDefined, range } from './utils';


const random = () => {
	return range(0, 14).map(d => {

		return Math.floor(Math.random() * 9) + 1
	}).join('')
}


export const matchLoosely = (n1, n2) => {
	return Math.floor(n1 / 1000) === Math.floor(n2/ 1000);
}


export const solve = (str: string) => {
	const program = parseInput(str);

	const parts = chunk(program, 18);

	const pattern = 'abcdedcdcdcba'.split('');

	const queue = range(1, 10).reverse().map((d) => {
		return {
			d,
			idx: 0,
			z: 0,
			total: `${d}`,
			map: new Map()
		}
	});

	const calcDigit = (z, d, i) => {
		return singleDigit(d, z, parts[i])
	}

	const found = [];

	while (queue.length) {
		const curr = queue.pop();
		const map = new Map(curr.map);

		const patternPos = pattern[curr.idx];
		const z = calcDigit(curr.z, curr.d, curr.idx);
1
		if (curr.idx === 13) {

			if (z === 0) {
				found.push(curr);
				console.log(`found`, curr.total);
			}
			continue;
		}
		
		const mapVal = map.get(patternPos);

		if (mapVal && !matchLoosely(mapVal, z)) {
			continue;
		}

		

		map.set(patternPos, z);

		const next = range(1, 10)
			.reverse()
			.map((d) => {
				return {
					d,
					idx: curr.idx + 1,
					z,
					total: `${curr.total}${d}`,
					map
				}
			});
			
		queue.push(...next);

		
	}

	return Math.min(...found.map(f => Number(f.total)));
}

describe('part 1 tests', () => {
	it('passes for case 1 if exists', () => {


		const program = parseInput(getTestCases()[0].input);
		// solve(getTestCases()[r0].input);

		// solve(getTestCases()[0].input);

		const binary = parseInput(`inp w
add z w
mod z 2
div w 2
add y w
mod y 2
div w 2
add x w
mod x 2
div w 2
mod w 2`);


		const conv1 = (n: number) => {
			const s = n.toString(2);
			return '0'.repeat(4 - s.length) + s;
		}

		const conv2 = (n: number) => {
			const {z, y, x, w} = run(binary, [n]);
			return [z, y, x, w].reverse().join('')
		};

		assert.equal(conv1(1), conv2(1));
		assert.equal(conv1(9), conv2(9));
		assert.equal(conv1(13), conv2(13));

		const t = '29638142427219'.split('').reduce((a,c) => a + Number(c), 0);
		const t1 = '29638142427219'.split('').reverse().join('')


		console.log(t1);
		
		//const P1 = [  1,  1,  1,  1,  1,  26,  26,  1, 26,  1, 26, 26,  26, 26 ]
		// 11111001010000

		const examples = [
			// [11111111214115, 6909090],
			// [11111111216115, 6909090],
			// [11111111349159, 10220],
			// [11139241111111, 6908833],

			// [27628137938226, 16],
			// [19658165727259, 15],
			//    [29638142427219, 0],
			   [29638142427219, 0],
		       [19919226827518, 0],
			   [19638147938218, 0],
			   [29939247938519, 0],
			   [59939247938519, 0],
			   [29939247938519, 0],
			   [29989297949519]
		     // 29638  2 2
			 //      14 4 7219
			 // 11111001010000

			 // 19919  6 2
			 //      22 8 7518
			

			//new min 16 - 25719226816337
			// [1111111131614, 10220]
		]

		for (let [e1, e2] of examples) {
			const actual = run(program, `${e1}`.split('').map(Number)).z;

			assert.equal(actual, e2, `${e2}`);

			const actual2 = calcZ(program,`${e1}`);
			assert.equal(actual2, e2);
		}

		// const bench = (fn: any) => {
		// 	const n = Date.now();

		// 	for (let i = 11111111214115; i < 11111211214115; i++) {
		// 		let x = fn(program, `${i}`);
		// 	}
		// 	return Date.now() - n;
		// }

		// const base = bench(run);
		// const calc = bench(calcZ);

		// solve(getTestCases()[0].input)
	})
});
		
	