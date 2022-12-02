// import { puzzleInput } from "../lib/lib";
import {assert} from 'chai';
import { validateLocaleAndSetLanguage } from 'typescript';
import { getTestCases } from '../runtime/lib/get-tests';
import { readInputFile } from '../runtime/lib/input-output-files';
import { entries, range, values } from './utils';

const parseInput = (raw: string) => {
	const [f, s] = raw
		.split('\n\n')

	return {template: f, ins: s.split('\n').map(r => {
		const [from, to] = r.split(' -> ');
		return {from, to};
	})};

	// return gridFromMatix(rows);
	// return rows;
}

export const solve = (raw: string): any => {
	const {template, ins} = parseInput(raw);

	const map = ins.reduce((acc, {from, to}) => {
		return acc.set(from, to);
	}, new Map());

	const totals = new Map()

	for (let i = 0; i < template.length - 1; i++) {
		const s1 = template[i];
		const s2 = template[i + 1];
		const p = s1 + s2;
		// const t = map.get(p);
		
		const c = totals.get(p) || 0;
		totals.set(p, c + 1);

		const chrCount = totals.get(s1) || 0;
		totals.set(s1, chrCount + 1);
	}
	const chrCount2 = totals.get(template[template.length - 1]) || 0;
	totals.set(template[template.length - 1], chrCount2 + 1);
	
	console.log(totals);
	

	const applyStep = (curr) => {
		const newMap = new Map();

		return entries(curr).reduce((newMap, ent: any) => {


			if (ent[0].length === 1) {
				const curr = newMap.get(ent[0]) || 0
				return newMap.set(ent[0], curr + ent[1])
				// if (!newMap.has(ent[0])) {
				// }
				// return newMap;
				// const cur = newMap.get(ent[0]) || cur;
				// return newMap.set(ent[0], ent[1]);
			}

			const [s1, s2] = ent[0].split('')
			const t = map.get(ent[0])

			const n1 = s1 + t;
			const n2 = t + s2;
			
			const curr1 = newMap.get(n1) || 0
			newMap.set(n1, curr1 + ent[1] )

			const curr2 = newMap.get(n2) || 0
			newMap.set(n2, curr2 + ent[1] )


			const currT = newMap.get(t) || 0;
			

			newMap.set(t, currT + ent[1]);

			return newMap;

		}, newMap);
	}

	const final = range(0, 40).reduce((acc, step) => {
		console.log(step);
		
		return applyStep(acc)
	}, totals);


	// console.log(final);
	

	const counts = entries(final)
		.filter(e => e[0].length === 1)
		.map(e => e[1])

	// console.log(counts);
	
		// .map(e => e[1])
	// 	.reduce((map, curr) => {
	// 	const ch = curr[0]
	// 	console.log(ch);
		
	// 	const c = map.get(ch) || 0;
	// 	map.set(ch, c + curr);
	// 	return map;
	// }, new Map());
	const sorted = counts.sort((v2: any, v1: any) => v1 - v2);
	// console.log(sorted);
	

	// console.log(sorted);
	
	// console.log(step, sorted.map(p => `${p[0]}: ${p[1]}`).join('\n'));
	// console.log(applied.s);

	// str.push(applied.s);
	
	// return applied.initNode;
	// console.log(sorted);
	
	
	
	
	return sorted[0] - sorted[sorted.length - 1]
		

	// return 'OK';

	// const chars = final.split('').reduce((map, curr) => {
	// 	const c = map.get(curr) || 0;
	// 	return map.set(curr, c + 1);
	// }, new Map());

	// const sorted = values(chars).sort((v2, v1) => v1 - v2);

	// return sorted[0] - sorted[sorted.length - 1]
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
