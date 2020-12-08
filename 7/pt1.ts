import { puzzleInput } from "./puzzle-input";
import {assert} from 'chai';

export const solve = (input: string): any => {

	const map = new Map();
	const n = input.split('\n').map(n => n.trim()).filter((v) => !!v)
		.forEach((value) => {
			const [first, rest] = value.split('contain');

			const f = first.replace('bags', '').trim();

			let bg = rest
				.replace(/bags?/g, '')
				.replace(/\./g, '')
				.split(',').map(v => v.trim());

			if (bg[0] === 'no other') {
				bg = [];
			}
			const obj = bg.reduce((a, p) => {

				const n = p.match(/\d*/)[0];

				const color = p.match(/[a-z ]+/)[0];
				console.log(color, n);

				a[color.trim()] = parseInt(n);

				return a;
			}, {})

			map.set(f, obj);
		})

		const visit = (color) => {
			const c = map.get(color);
			const next = Object.entries(c);

			return next.reduce((acc, [c, v]) => {
				const bob = visit(c) + 1;
				return acc + (bob * (v as number));
			}, 0);
		}

		return visit('shiny gold');
		// while (queue.length && nn-- > 0) {

		// 	const curr = queue.shift();



		// 	const children = map.get(curr);

		// 	console.log(children);



		// 	// const parents = colors.filter(([c, obj]) => {
		// 	// 	if (obj[curr] > 0) {
		// 	// 		return true;
		// 	// 	}
		// 	// 	return false;
		// 	// })
		// 	// .filter(c => !visited.has(c))
		// 	// .map(([k, v]) => k);

		// 	// queue.push(...parents);
		// }

		// console.log(visited);

		// return visited.size - 1;





	return n;
};

describe('bob', () => {	
	it('works for test case 1', () => {
		const input = `light red bags contain 1 bright white bag, 2 muted yellow bags.
dark orange bags contain 3 bright white bags, 4 muted yellow bags.
bright white bags contain 1 shiny gold bag.
muted yellow bags contain 2 shiny gold bags, 9 faded blue bags.
shiny gold bags contain 1 dark olive bag, 2 vibrant plum bags.
dark olive bags contain 3 faded blue bags, 4 dotted black bags.
vibrant plum bags contain 5 faded blue bags, 6 dotted black bags.
faded blue bags contain no other bags.
dotted black bags contain no other bags.`;

		assert.equal(solve(input), 32);
	});

	it('works for test case 2', () => {
		const input = `shiny gold bags contain 2 dark red bags.
dark red bags contain 2 dark orange bags.
dark orange bags contain 2 dark yellow bags.
dark yellow bags contain 2 dark green bags.
dark green bags contain 2 dark blue bags.
dark blue bags contain 2 dark violet bags.
dark violet bags contain no other bags.`;

		assert.equal(solve(input), 126);
	});

	// it('works for test case 3', () => {
	// 	const input = `HERE`;

	// 	assert.equal(solve(input), 424242);
	// });

	it('show the answer when ready!', () => {

		// const expected = 42;

		// assert.equal(solve(puzzleInput), 'bob');
	});
});

