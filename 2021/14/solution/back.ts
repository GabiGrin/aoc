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

	const Node = (c, next?, prev?) => ({c, next, prev});

	const [first, ...rest] = template.split('');

	const root = Node(first);

	const join = (n1, n2) => {
		n1.next = n2;
		n2.prev = n1;
	}


	rest.reduce((acc, c) => {
		const next = Node(c);
		join(acc, next);
		return next;
	}, root);


	const map = ins.reduce((acc, {from, to}) => {
		return acc.set(from, to);
	}, new Map())
	
	const apply = (initNode: ReturnType<typeof Node>) => {
		let curr = initNode.next;
		let prev = initNode;
		let s = initNode.c;
		while (curr) {
			const cc = prev.c + curr.c;
			const t = map.get(cc);
			const newNode = Node(t, curr, prev);
			join(prev, newNode)
			join(newNode, curr)
			s+= (t + curr.c)
			prev = curr;
			curr = curr.next;
		}
		// console.log(s, initNode);
		return {initNode, s};
	}

	const p1 = apply(root);
	
	let str = [];

	const final = range(0, 10).reduce((acc, step) => {
		
		
		const applied = apply(acc);
		const chars = applied.s.split('').reduce((map, curr) => {
			const c = map.get(curr) || 0;
			return map.set(curr, c + 1);
		}, new Map());
		const sorted = entries(chars).sort((v2: any, v1: any) => v1[1] - v2[1]);
		console.log(step, sorted.map(p => `${p[0]}: ${p[1]}`).join('\n'));
		console.log(applied.s);

		str.push(applied.s);
		
		return applied.initNode;
		
	}, p1.initNode);

	console.log(str.join('\n\n'));
	
	
	
	// return sorted[0] - sorted[sorted.length - 1]
		

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
