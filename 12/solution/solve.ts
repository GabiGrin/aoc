// import { puzzleInput } from "../lib/lib";
import {assert} from 'chai';
import { getTestCases } from '../runtime/lib/get-tests';
import { readInputFile } from '../runtime/lib/input-output-files';
import { gridFromMatix, keys } from './utils';
import { createGraph } from './utils/graphs';
import { simpleAdd } from './utils/math';

const node = (name: string) => {
	return {
		name,
		children: [],
		parents: []
	}
};

const parseInput = (raw: string) => {
	const rows = raw
		.split('\n')
		.map(n => n.trim())
		.filter((v) => !!v)
		.map((row) => {
			const [from, to] = row.split('-');
			return {from, to};
		})
		.reduce((graph, {from, to}) => {

			graph.addNode(from);
			graph.addNode(to);
			graph.addConnection(from, to, true);

			return graph;
		}, createGraph());
	
	return rows;

}

export const solve = (raw: string): any => {
	const graph = parseInput(raw);
	
	const isBigCave = ((n: string) => n.toUpperCase() === n );
	const hasDoubleSmallCave = (path) => path
		.filter(c => !isBigCave(c))
		.some((c, i, arr) => arr.indexOf(c) !== i);

		const paths1 = graph.allPaths('start', 'end', (next, path) => {
			if (isBigCave(next) || !path.includes(next)) {			
				return true;
			}

		});

	const paths2 = graph.allPaths('start', 'end', (next, path) => {
		if (next === 'start') {
			return false;
		}
		if (isBigCave(next) || !hasDoubleSmallCave(path)) {			
			return true;
		}
		return !path.includes(next);
	});
	
	return paths2.length;
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

	it.only('passes for case 2 if exists', () => {
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
