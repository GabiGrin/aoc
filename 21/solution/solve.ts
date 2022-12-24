// import { puzzleInput } from "../lib/lib";
import {assert} from 'chai';
import { getTestCases } from '../runtime/lib/get-tests';
import { readInputFile } from '../runtime/lib/input-output-files';

const parseInput = (raw: string) => {
	const rows = raw
		.split('\n')
		.map(r => {
			const [, name, formula] = r.match(/^(.*): (.*)$/);
			const fn = new Function(`return ${formula.replace(/([a-z]{4})/g, 'arguments[0].get("$1")')}`)
			return {name, fn, formula}
		})
	return {monkeys: rows.filter((r) => !['root'].includes(r.name)), root: rows.find(r => r.name === 'root')};
}

export const solve = (raw: string): any => {
	const {monkeys, root} = parseInput(raw);

	const queue = [{m: root, d:0}];

	const order = [];

	while (queue.length) {
		const next = queue.shift();
		const matches = next.m.formula.match(/([a-z]{4}).*([a-z]{4})/)
		if (matches) {
			const [, d1, d2] = matches;
			const d2m = monkeys.find(m => m.name === d2)

			if (!order.find(d => d.name === d1)) {
				const d1m = monkeys.find(m => m.name === d1)

				if (d1 !== 'humn') {
					order.push({name: d1, d: next.d + 1, m: d1m})
					queue.push({m: d1m, d: next.d + 1})
				}
			}

			if (!order.find(d => d.name === d2)) {
				if (d2 !== 'humn') {
					const d2m = monkeys.find(m => m.name === d2)
					order.push({name: d2, d: next.d + 1, m: d2m})
					queue.push({m: d2m, d: next.d + 1})
				}
			}
		}
	}


	order.sort((a, b) => b.d - a.d);
	const m2 = new Map();
	for (const item of order) {
		const {m} = item;

		const formula = m.formula.replace(/([a-z]{4})/g, (p) => {
			const b= m2.get(p) || p;

			return isNaN(b) ? `(${b})` : b; 
		})
		
		m2.set(m.name, formula)
		console.log(formula);

	}

	const [, rd1, rd2] = root.formula.match(/([a-z]{4}).*([a-z]{4})/);

	const d1 = m2.get(rd1)
	const d2 = m2.get(rd2)

	const v1 = d1.includes('humn') ? Function('return ' + d1.replaceAll('humn', 'arguments[0]')) : eval(d1);
	const v2 = d2.includes('humn') ? Function(d2.replace('humn', 'arguments[0]')) : eval(d2);

	const f  = typeof v1 === 'number' ? v2 : v1;
	const n  = typeof v1 === 'number' ? v1 : v2;
	let h =0
	while (true) {
		if (h% 1000 === 0) {
			console.log('h', h);
			console.log(f(h) - n)
			
		}

		if (f(-h) === n) return -h
		if (f(h) === n) return h

		const diff = Math.abs(f(h) - n);
		h+= Math.max(1, Math.floor(diff / 100));
	}
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
