// import { puzzleInput } from "../lib/lib";
import {assert} from 'chai';
import { getTestCases } from '../runtime/lib/get-tests';
import { hasInputFile, readInputFile } from '../runtime/lib/input-output-files';
import { keys, simpleAdd } from './utils';

const parseInput = (raw: string) => {
	const rows = raw
		.split('\n')
		.map(n => n.trim())
		.filter((v) => !!v)
		.map(row => {

			const [input, output] = row.split(' | ');
			return {input: input.split(' '), output: output.split(' ')};
		});

	return rows;
}

export const solve = (raw: string): any => {
	const input = parseInput(raw);

	type Letter = 'a' | 'b' | 'c' | 'd' | 'e' | 'f' | 'g';

	type Options = {
		upperHor: Letter[],
		midHor:  Letter[],
		botHor:  Letter[],
		upperLeft:  Letter[],
		bottomLeft:  Letter[],
		upperRight:  Letter[],
		bottomRight:  Letter[]
	}

	type Segment = keyof Options;

	type ReverseOptions = Record<Letter, Segment[]>;


	const allLetters: Letter[] = ['a', 'b', 'c', 'd', 'e', 'f', 'g']

	const defaultOptions: Options = {
		upperHor: allLetters,
		midHor: allLetters,
		botHor: allLetters,
		upperLeft: allLetters,
		bottomLeft: allLetters,
		upperRight: allLetters,
		bottomRight: allLetters
	}

	const allSegments: Segment[] = Object.keys(defaultOptions) as Segment[];

	const defaultReveseOpts: ReverseOptions = {
		a: allSegments,
		b: allSegments,
		c: allSegments,
		d: allSegments,
		e: allSegments,
		f: allSegments,
		g: allSegments
	}

	const emptyOpts: ReverseOptions = {
		a: [],
		b: [],
		c: [],
		d: [],
		e: [],
		f: [],
		g: []
	}

	const litParts: Record<number, Array<keyof Options>> = {
		0: ['upperHor', 'botHor', 'upperLeft', 'upperRight', 'bottomLeft', 'bottomRight'],
		1: ['upperRight', 'bottomRight'],
		2: ['upperHor', 'botHor', 'midHor', 'upperRight', 'bottomLeft'],
		3: ['upperHor', 'botHor', 'midHor', 'upperRight', 'bottomRight'],
		4: ['midHor', 'upperLeft', 'upperRight', 'bottomRight'],
		5: ['midHor', 'upperHor', 'botHor', 'upperLeft', 'bottomRight'],
		6: ['midHor', 'upperHor', 'botHor', 'upperLeft', 'bottomLeft', 'bottomRight'],
		7: ['upperHor', 'upperRight', 'bottomRight'],
		8: ['upperHor', 'midHor', 'botHor', 'upperLeft', 'upperRight', 'bottomLeft', 'bottomRight'],
		9: ['midHor', 'upperHor', 'botHor', 'upperLeft', 'upperRight', 'bottomRight'],
	}

	const removeAllBut = (options: Options, keys: Array<keyof Options>, letters: Letter[]): Options => {
		const newOptions: Options = {...options}

		for (let key in newOptions) {
			if (!keys.includes(key as any)) {
				newOptions[key] = newOptions[key].filter(l => !letters.includes(l));
			}
		}
		return newOptions
	}

	const removeOptions = (options: Options, digit: number, letters: Letter[]): Options => {
		const newOptions = {...options};

		// console.log(uniqueDigits, letterToCount);
		const keys = litParts[digit];
		if (!keys) throw 'bob';

		return removeAllBut(newOptions, keys, letters);
	}

	const otherMap = {
		2: [1],
		4: [4],
		3: [7],
		7: [8],
		5: [2, 3, 5],
		6: [0, 6, 9]
	}

	const [first, second, third] = input;

	const deduceStuff = (allWords: string[]) => {
		const opts = {...defaultReveseOpts};
		const probs = {...otherMap};


		const processWord = (word) => {
			const cnt = word.length;
			const prob = probs[cnt];

			const letters = word.split('') as Letter[];

			if (prob.length === 1) {
				const digit = prob[0];
				const segments = litParts[digit];

				for (let letter in opts) {

					// remove the impossible segments from each letter that does not appear
					if (!letters.includes(letter as Letter)) {
						opts[letter] = opts[letter].filter(s => !segments.includes(s))
						// console.log('removing', segments, 'from', letter, `digit (${digit})`);
					} else {
						opts[letter] = opts[letter].filter(s => segments.includes(s))
						// console.log('removing segments other than', segments, 'from', letter, `digit (${digit})`);
					}
				}
			} else {
				const remainingOptions = prob.filter((digitToCheck) => {
					const neededForDigit = litParts[digitToCheck];
					const possibleLitParts = letters.reduce((set, c) => {
						const actual = opts[c];
						// console.log(actual);
						actual.forEach(a => set.add(a));
						return set;
					}, new Set())


					if (c) {
						console.log('checking digit', digitToCheck, 'needs', neededForDigit, opts, letters);
					}
					
					return neededForDigit.every(c => possibleLitParts.has(c));						
				});
				if (remainingOptions.length < 3) {

					console.log(remainingOptions);
				}
	
			}
		}

		// for each number I know, I wanna remove the the letters from other options
		// so that for further numbers I can see who doesn't make sense

		const validatePermutations = (opts: ReverseOptions) => {

			const found = new Map();
			allWords.forEach((word, i) => {
				const letters = word.split('');

				const segments = letters.map(letter => opts[letter][0]).sort().join(',');

				for (let k in litParts) {
					const p = [...litParts[k]].sort().join(',');
					
					if (segments === p){
						found.set(k, (found.get(k) || 0) + 1);						
					}
					
				}
			});

			return found.size === 10;
		
		}

		let c = 0;
		const iterate = (c) => {
			allWords.forEach((word) => {
				processWord(word);
			});
		}

		iterate(c);

		const calcPermutation = (opts: ReverseOptions) => {
			const finished = Object.values(opts).every(o => o.length === 1);
			if (finished) {
				return [opts];
			} else {
				const firstDouble = Object.entries(opts).find(([k, e]) => opts[k].length > 1);

				const possibilities = firstDouble[1];
				const perms = possibilities.map((opt) => {
					return {...opts, [firstDouble[0]]: [opt]};
				})

				return perms.reduce((acc, perm) => {
					return [...acc, ...calcPermutation(perm)]
				}, [])
				
				
			}
		}

		const permutations = calcPermutation(opts);

		const valid = permutations.filter(validatePermutations);

		if (valid.length !== 1) {
			throw 'bob';
		}

		return valid[0];
		
		

	}

	// console.log(deduceStuff(first.input));
	// console.log(deduceStuff(second.input));
	return input.map(({input: allWords, output}) => {

		const opt = deduceStuff(allWords);

		const digits = output.map((word) => {

			
			const segments = word.split('').reduce((all, l) => {

				const lit = opt[l][0];
				console.log(lit);
				return [...all, lit];
				
			}, []).sort().join(',');

			return Object.keys(litParts).find((d) => {
				const p = litParts[d].sort().join(',');				
				return p === segments;
			});
			
		})

		return parseInt(digits.join(''));
	})
	.reduce(simpleAdd);
	

	// first.input.forEach((word) => {

	// 	const count = word.length;

	// 	const probs = otherMap[count];
	// 	console.log(probs, word);
		

	// })


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
