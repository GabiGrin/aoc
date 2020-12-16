import { puzzleInput } from "./puzzle-input";
import { assert } from 'chai';
import { setCell } from "./utils";


const parseInput = (raw: string) => {
	const rows = raw
		.split('\n')
		.map(n => n.trim())
		.filter((v) => !!v)


	return rows.map((r) => {


		if (r.includes('mask = ')) {
			return {
				mask: r.replace('mask = ', '')
			}
		}

		const [location, value] = r.match(/mem\[(\d+)\] = (\d+)/).slice(1).map(Number);
		return { location, value };
	});

	const [maskRaw, ...rest] = rows;

	const cmds = rest.map(r => {
		const [location, value] = r.match(/mem\[(\d+)\] = (\d+)/).slice(1).map(Number);
		return { location, value };
	})

	return { mask: maskRaw.replace('mask = ', ''), cmds };
	// .map(Number);

	// const grid = new Map();
	// rows.forEach((row, y) => {
	// 	row.split('').forEach((cell, x)  => {
	// 		const value = cell;
	// 		setCell({x, y}, value, grid);
	// 	})
	// }

	console.log(rows);
	return rows;
}

export const solve = (raw: string): any => {
	const cmds = parseInput(raw) as any;

	let mem = {};
	let mask = '';

	const cache = new Map();

	const calcPermutations = (add: string) => {
		if (!cache.get(add)) {
			const permutations = [];

			const queue = [add];

			while (queue.length) {
				const next = queue.shift();

				if (next && !next.includes('X')) {
					permutations.push(next);
					continue;
				}

				const nextIdx = next.indexOf('X');

				const n1 = next.split('');
				const n2 = next.split('');
				n1[nextIdx] = '0';
				n2[nextIdx] = '1';
				queue.push(n1.join(''));
				queue.push(n2.join(''));
			}
			cache.set(add, permutations)
		}
		return cache.get(add);
	}

	cmds.forEach((cmd) => {
		if (cmd.mask) {
			mask = cmd.mask;
			return;
		}
		const { location, value } = cmd;


		const address = location.toString(2).split('').reverse();

		const newAddress = mask.split('').reverse().map(((c, i) => {
			const v = address[i] || '0';
			if (c === '0') return v;
			return c;
		})).reverse().join('');

		const permutations = calcPermutations(newAddress);// console.log(permutations);

		permutations.forEach((add) => {
			mem[add] = value;
		})
	})

	return Object.values(mem).reduce((acc: any, p: any) => acc + BigInt(p), BigInt(0));
};

describe('bob', () => {
	it('works for test case 1', () => {
		const input = `mask = 000000000000000000000000000000X1001X
mem[42] = 100
mask = 00000000000000000000000000000000X0XX
mem[26] = 1`;

		assert.equal(solve(input), 208);
	});

	// it('works for test case 2', () => {
	// 	const input = `HERE`;

	// 	assert.equal(solve(input), 424242);r
	// });

	it('show the answer when ready!', () => {

		// const expected = 42;

		// assert.equal(solve(puzzleInput), 'bob');
	});
});

