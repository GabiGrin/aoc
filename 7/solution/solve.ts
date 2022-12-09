// import { puzzleInput } from "../lib/lib";
import {assert} from 'chai';
import { getTestCases } from '../runtime/lib/get-tests';
import { readInputFile } from '../runtime/lib/input-output-files';
import { createGraph } from './utils/graphs';

const parseInput = (raw: string) => {
	const rows = raw
		.split('\n')
		.map(n => n.trim())
		.filter((v) => !!v)
		.map(r => {

			if (r.startsWith('$')) {
				const [, cmd, arg] = r.split(' ');
				console.log(cmd, arg);
				
				return {
					cmd,
					arg
				}
			} else {
				const [a, b] = r.split(' ');
				// console.log(file, size);
				if (a === 'dir') {	
					console.log(a, b);
									
					return {
						dir: a,
						name: b
					}
				} else {
					return {
						file: b,
						size: Number(a)
					}

				}
				
			}
			// return r;
		})
		// .map(Number);
		// .map(v => v.split('').map(Number));

	// return gridFromMatix(rows);
	return rows;
}

export const solve = (raw: string): any => {
	const input = parseInput(raw);

	console.log(input);
	
	input.shift();
	console.log(input);

	const root = {name: '/', children: [], size: 0, parent: null as any};


	let curr = root;

	// let last = '/';


	input.forEach((item) => {
		if (item.cmd) {
			if (item.cmd === 'cd') {
				if (item.arg === '..') {
					curr = curr.parent;
				} else {
					const folder = curr.children.find(dir => dir.name === item.arg);
					curr = folder;
				}

			} 
		} else {
			// if ()
			if (item.dir) {
				curr.children.push({name: item.name, children: [], size: 0, parent: curr});
			} else {
				curr.children.push({name: item.file, children: [], size: item.size, parent: curr});
			}

		}
	});

	const findSize = (item: typeof curr) => {

		if (item.size && !item.children.length) {
			console.log(item.size);
			
			return item.size;
		}
		if (item.children.length) {
			console.log(item.name);
			
			const total = item.children.reduce((c, a) => c + findSize(a), 0);
			console.log(item.name);
			console.log(total);
			return total;
		}
	}

	
	const findSmallerThan = (item: typeof curr, size) => {
		const s = findSize(item);
		if (s > size && item.children.length) {

			const findings = item.children.reduce((a, b) => {
				const f = findSmallerThan(b, size);
				return [...a, ...f];
			}, []);
			// console.log(findings.length);
			

			return [{...item, size: s},...findings];
		} else {
			if (item.children.length) {
				const findings = item.children.reduce((a, b) => {
					const f = findSmallerThan(b, size);
					return [...a, ...f];
				}, []);
				return findings;
			} else {
				return [];
			}
		}
	}

	const total = 70000000;
	const now = total - findSize(root);
	const missing = 30000000 - now;

	console.log(missing);
	

	const items = findSmallerThan(root, missing);

	const sizes = items.map(i => i.size);
	return Math.min(...sizes);
	
	
	return items.reduce((a, b) => a + b.size, 0);
	
	

	return input.length;
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
