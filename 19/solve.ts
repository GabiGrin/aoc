import { puzzleInput } from "./puzzle-input";
import {assert} from 'chai';

const parseInput = (raw: string) => {
	const [rulesRaw, inputRaw] = raw
		.split('\n\n');

	const rules = rulesRaw.split('\n')
		.map(n => n.trim())
		.filter((v) => !!v)
		.reduce((all, row) => {
			const [num, r] = row.split(': ');
			return {
				...all,
				[num]: r
			}
		}, {});



	const inputs = inputRaw.split('\n')
		.map(n => n.trim())
		.filter((v) => !!v);
		// .map(Number);

	// const grid = new Map();
	// rows.forEach((row, y) => {
	// 	row.split('').forEach((cell, x)  => {
	// 		const value = cell;
	// 		setCell({x, y}, value, grid);
	// 	})
	// }

	rules[8] = '42 | 42 8'
	rules[11] = '42 31 | 42 11 3';

	return {inputs, rules};
}

export const solve = (raw: string): any => {
	const {inputs, rules} = parseInput(raw);

	// console.log(inputs, rules);

	const c = new Map();

	const permutations = (ruleNum) => {

		if (!c.get(ruleNum)) {
			const rule = rules[ruleNum];


			const m = rule.match(/"([ab])"/)
			if (m) {
				return [m[1]];
			}
			const parts = rule.split(' | ');
	
			// if (parts.length === 1) {
			// 	const subParts = parts[0].split(' ');
			// 	console.log(subParts);
	
			// 	const inner = subParts.map(permutations);
			// 	console.log(inner);
	
			// }
	
			const bobs = parts.reduce((ret, curr) => {
	
				const subParts = curr.split(' ');
	
				const perms = subParts.map(permutations);
	
				// console.log(perms);
	
				const calc = perms.reduce((acc, per) => {
					if (acc.length === 0) {
						return per;
					}
	
					const ac = [];
	
					per.forEach((p) => {
						acc.forEach((a) => {
							// console.log({a, p});
							ac.push(`${a}${p}`);
						})
					});
					// console.log({acc, per});
					return ac;
				}, [])
	
				return [...ret, ...calc];
		
			}, [])
	
			// console.log(bobs);
			c.set(ruleNum, bobs);
		}

		return c.get(ruleNum);
		
	}

	const all = permutations(0).sort();
	// console.log(all)
	return inputs.sort().filter((i) => {
		return !!all.find(ii => i === ii);
	}).length;
	

};

describe('bob', () => {	
	it('works for test case 1', () => {
		const input = `0: 4 1 5
1: 2 3 | 3 2
2: 4 4 | 5 5
3: 4 5 | 5 4
4: "a"
5: "b"
6: 4 5 4

ababbb
bababa
abbbab
aaabbb
aaaabbb`;

		assert.equal(solve(input), 2);
	});

	it('works for test case 2', () => {
		const input = `0: 1 2
1: "a"
2: 1 3 | 3 1
3: "b"

aab
aba`;

		assert.equal(solve(input), 2);
	});

	it('show the answer when ready!', () => {

		// const expected = 42;

		assert.equal(solve(puzzleInput), 'bob');
	});
});

