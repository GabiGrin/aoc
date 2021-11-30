import { puzzleInput } from "./puzzle-input";
import { assert } from 'chai';

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

	/*
	8: 42 | 42 8
	11: 42 31 | 42 11 31
	*/


	rules[8] = '42 | 42 8'
	rules[11] = '42 31 | 42 11 31';

	return { inputs, rules };
}

export const solve = (raw: string): any => {
	const { inputs, rules } = parseInput(raw);

	const max = Math.max(...inputs.map((i) => i.length));

	// const c = new Map();

	const worthTrying = subStr => {
		return inputs.some(inp => {
			return subStr.length <= inp.length && inp.includes(subStr);
		});
	}

	const permutations = (ruleNum, rt = new Map()) => {

		const rule = rules[ruleNum];

		const m = rule.match(/"([ab])"/)
		if (m) {
			return [m[1]];
		}
		const parts = rule.split(' | ');

		rt.set(ruleNum, (rt.get(ruleNum) || 0) + 1);

		let bobs = parts.reduce((ret, curr) => {

			const subParts = curr.split(' ');

			// console.log(cyclics);

			const perms = subParts.map(sp => {
				const t = rt.get(sp) || 0;
				console.log({t, sp})
				if (t < 1000) {
					return permutations(sp, rt);
				} else {
					console.log('stuck?');
					return [];
				}

			}).filter((v) => !!v);

			console.log(perms.length, Date.now());

			const calc = perms.reduce((acc, per) => {
				if (acc.length === 0) {
					return per;
				}

				const ac = [];

				per.forEach((p) => {
					acc.forEach((a) => {
						const j = `${a}${p}`
						if (worthTrying(j)) {
							ac.push(j);
						} else {
							// console.log('no');
						}
					})
				});
				// console.log({acc, per});
				return ac;
			}, [])

			return [...ret, ...calc];

		}, [])

		// const a = Array.from(new Set(bobs));
		console.log('Setting', ruleNum, bobs.length);
		return bobs;

	}


	const all = permutations(0).sort();
	console.log('finished!', all.length);

	const s = new Set(inputs);
	// console.log(all)
	return all.filter(a => s.has(a)).length;

	// return valids.length;

};

describe('bob', () => {
	it('works for test case 1', () => {
		const input = `42: 9 14 | 10 1
9: 14 27 | 1 26
10: 23 14 | 28 1
1: "a"
11: 42 31
5: 1 14 | 15 1
19: 14 1 | 14 14
12: 24 14 | 19 1
16: 15 1 | 14 14
31: 14 17 | 1 13
6: 14 14 | 1 14
2: 1 24 | 14 4
0: 8 11
13: 14 3 | 1 12
15: 1 | 14
17: 14 2 | 1 7
23: 25 1 | 22 14
28: 16 1
4: 1 1
20: 14 14 | 1 15
3: 5 14 | 16 1
27: 1 6 | 14 18
14: "b"
21: 14 1 | 1 14
25: 1 1 | 1 14
22: 14 14
8: 42
26: 14 22 | 1 20
18: 15 15
7: 14 5 | 1 21
24: 14 1

abbbbbabbbaaaababbaabbbbabababbbabbbbbbabaaaa
bbabbbbaabaabba
babbbbaabbbbbabbbbbbaabaaabaaa
aaabbbbbbaaaabaababaabababbabaaabbababababaaa
bbbbbbbaaaabbbbaaabbabaaa
bbbababbbbaaaaaaaabbababaaababaabab
ababaaaaaabaaab
ababaaaaabbbaba
baabbaaaabbaaaababbaababb
abbbbabbbbaaaababbbbbbaaaababb
aaaaabbaabaaaaababaa
aaaabbaaaabbaaa
aaaabbaabbaaaaaaabbbabbbaaabbaabaaa
babaaabbbaaabaababbaabababaaab
aabbbbbaabbbaaaaaabbbbbababaaaaabbaaabba`;

		assert.equal(solve(input), 12);
	});

	it('works for test case 2', () => {
		const input = `0: 1 2
1: "a"
2: 1 3 | 3 1
3: "b"

aab
aba`;

		// assert.equal(solve(input), 2);
	});

	it('show the answer when ready!', () => {

		// const expected = 42;

		// assert.equal(solve(puzzleInput), 'bob');
	});
});

