import { puzzleInput } from "./puzzle-input";
import { assert } from 'chai';
import { write, writeFileSync } from "fs";

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


	// rules[8] = '42 | 42 8'
	// rules[11] = '42 31 | 42 11 3';

	return { inputs, rules };
}




export const solve = (raw: string): any => {
	const { inputs, rules } = parseInput(raw);

	// console.log(inputs, rules);

	const c = new Map();


	const worthTrying = subStr => {
		return inputs.some(inp => {
			return subStr.length <= inp.length && inp.includes(subStr);
		});
	}

	const permutations = (root) => {
		const queue = [{ ids: [root], str: '', d: 0 }];

		const all = [];
		while (queue.length) {

			// console.log(queue.length);

			const { ids, str, d } = queue.pop();

			if (!ids) {
				// console.log(ids, str, queue)
			}

			// console.log(str, ids, queue)

			if (ids.length === 0) {
				all.push(str);
				continue;
			}

			const nextId = ids.pop();

			const rule = rules[nextId];

			const m = rule.match(/"([ab])"/)

			if (m) {
				queue.push({ ids, str: `${m[1]}${str}`, d: d + 1 })
			} else {
				const parts = rule.split(' | ');

				parts.forEach((p) => {

					const ns = p.split(' ');
					const newIds = [...ids, ...ns];

					if (worthTrying(str)) {
						queue.push({
							ids: newIds,
							str,
							d: d + 1
						});
					}
				});
			};

		}
		return all;

	}




	const perm42 = new Set(permutations(42));
	const perm31 = new Set(permutations(31));

	// writeFileSync('./perm42input.txt', perm42.join('\n'));
	// writeFileSync('./perm31input.txt', perm31.join('\n'));

	// console.log(perm42, perm31);


	// const valids = inputs.sort().filter((i) => {
	// 	return !!all.find(ii => i === ii);
	// });

	/*
	8: 42 | 42 8
	11: 42 31 | 42 11 31

	8 11 - 42 42 31
	8 8 11 - 42 42 31
	8 8 8 11 - 42 42 31
	8 8 11 - 42 42 31

	42+ -> 42 31 | 42 42 31 31 | 42 42 42 31 31 31 | 42 42 42 42 31 31 31 31 | 42 42 42 42 42 31 31 31 31 31
	
	
	*/

	const reducted = inputs.map((row) => {

		const r = [];

		for (let i =0 ; i< row.length / 8; i++) {
			const chunk = row.substr(i * 8, 8);

			const h42 = perm42.has(chunk);
			const h31 = perm31.has(chunk);

			if (h42 && h31) {
				throw 'bob'
			} 
			
			if (h42) {
				r.push('A')
			} else if (h31) {
				r.push('B');
 			} else {
				 throw 'bob';
				 //wat
			 }
		}
		return r.join('');
	});


	const valids = reducted.filter((r) => {

		const validStart = r.match(/^A+./);
		const validEnd = r.match(/B+$/);


		if (validStart && validEnd) {


		} else {
			console.log(r);
			return false;
		}
		// console.log(r);		


		// o
		while (r.includes('B')) {

			if (!r.includes('AB')) {
				return false;
			}
			r = r.replace('AB', '');
			// console.log('R', r)
		}
		return r.length > 0;		
	})

	console.log(valids.sort());
	writeFileSync('./valids2.txt', valids.join('\n'));


	return valids.length;

	

	// writeFileSync('./valids1.txt', valids.join('\n'));




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

		// assert.equal(solve(input), 3);
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

		assert.equal(solve(puzzleInput), 'bob');
	});
});
