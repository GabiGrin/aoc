// import { puzzleInput } from "../lib/lib";
import {assert} from 'chai';
import { nodeModuleNameResolver, validateLocaleAndSetLanguage } from 'typescript';
import { getTestCases } from '../runtime/lib/get-tests';
import { readInputFile } from '../runtime/lib/input-output-files';
import { gridFromMatix, keys } from './utils';
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
		});

	
		const nodesMap = new Map<any, any>();
		const root = node('start');

	rows.forEach(({from, to}) => {
		const fromNode = nodesMap.get(from) || node(from);
		const toNode = nodesMap.get(to) || node(to);

		fromNode.children.push(to);
		toNode.parents.push(from);
		nodesMap.set(from, fromNode);
		nodesMap.set(to, toNode);
	})
	return {nodesMap};

}

export const solve = (raw: string): any => {
	const {nodesMap} = parseInput(raw);

	const root = nodesMap.get('start');
	
	const isBig = ((n: string) => n.toUpperCase() === n );

	const findPaths = (curr, visited, smallCaveTwice: {name: string, visited: boolean}, path) => {
		let newCaveTwice = {...smallCaveTwice};
		if (visited.has(curr.name)) {			
			if (newCaveTwice.name === curr.name) {
				if (newCaveTwice.visited) {
					return '';
				} else {
					newCaveTwice.visited = true;
				}
			} else {
				return '';
			}
		}

		if (curr.name === 'end') {	
			return path;
		}

		if (!isBig(curr.name)) {
			visited.add(curr.name);
		}

		const nextOnes = [...curr.children, ...curr.parents]

		const nextPaths = nextOnes.map(curr => {
			const n = nodesMap.get(curr);
			return findPaths(n, new Set(visited), newCaveTwice, path + ',' + curr);
		});

		return nextPaths
			.filter(p => p.length > 0)
			.reduce((a, c) => {
			if (typeof c === 'object') {
				return [...a, ...c]
			} 
			if (c.length) {
				return [...a, c]
			} else {
				return a
			}
		}, []);
	}

	const smallCaves = keys(nodesMap)
		.filter(n => !['start', 'end'].includes(n))
		.filter(n => !isBig(n));

	const paths = smallCaves.map(s => findPaths(root, new Set(), {name: s, visited: false}, []));	

	const combined = paths.reduce((a, c) => {
		return [...a, ...c];
	})
	return new Set(combined).size;
};

// for wallaby
describe('part 1 tests', () => {
	it.only('passes for case 1 if exists', () => {
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
