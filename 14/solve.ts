import { puzzleInput } from "./puzzle-input";
import {assert} from 'chai';
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
		return {location, value};
	});

		const  [maskRaw, ...rest] = rows;

		const cmds = rest.map(r => {
			const [location, value] = r.match(/mem\[(\d+)\] = (\d+)/).slice(1).map(Number);
			return {location, value};
		})

		return {mask: maskRaw.replace('mask = ', ''), cmds};
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

	let mem = [];
	let mask = '';

	console.log(mask);

	cmds.forEach((cmd) => {
		if (cmd.mask) {
			mask = cmd.mask;
			return;
		}
		const {location, value } = cmd;


		const bin = value.toString(2).split('').reverse();
		const newValue = mask.split('').reverse().map(((c, i) => {
			const v = bin[i] || '0';
			if (c === 'X') return v;
			return c;
		})).reverse().join('');

		console.log(newValue);
		


		mem[location] = parseInt(newValue, 2);
	})
	console.log(mem);

	return mem.reduce((acc, p) => acc + p, 0);
};

describe('bob', () => {	
	it('works for test case 1', () => {
		const input = `mask = XXXXXXXXXXXXXXXXXXXXXXXXXXXXX1XXXX0X
mem[8] = 11
mem[7] = 101
mem[8] = 0`;

		assert.equal(solve(input), 208);
	});

	// it('works for test case 2', () => {
	// 	const input = `HERE`;

	// 	assert.equal(solve(input), 424242);
	// });

	it('show the answer when ready!', () => {

		// const expected = 42;

		assert.equal(solve(puzzleInput), 'bob');
	});
});

