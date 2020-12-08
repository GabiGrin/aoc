import { puzzleInput } from "./puzzle-input";
import {assert} from 'chai';


const parseInput = (raw: string) => {
	const rows = raw
		.split('\n')
		.map(n => n.trim())
		.filter((v) => !!v)
		.map(n => {
			const [cmd, v] = n.split(' ');
			return { cmd, v: parseInt(v)}
		});

	return rows;
}

const runProg = (prog) => {
	let set = new Set();

	let acc = 0;


	let p = 0;
	while (p < prog.length) {

		const {cmd, v} = prog[p];

		if (set.has(p)) {
			console.log(acc, cmd, v, p);
			return false;
		}
		set.add(p);

		switch (cmd) {

			case 'nop':
				p++;
				break;
			case 'acc': 
				p++;
				acc = acc + v;
				break
			case 'jmp':
				p+=v;
				break;
		}
		
	}
	return acc;

}

export const solve = (rawInput: string): any => {

	const input = parseInput(rawInput);

	let opts = [];

	input.forEach((cmd, idx) => {
		const c = [...input];
		if (cmd.cmd === 'jmp') {
			c[idx] = {...c[idx], cmd: 'nop'}
		} else if (cmd.cmd === 'nop') {
			c[idx] = {...c[idx], cmd: 'jmp'}
		}
		opts.push(c);
	});

	return opts.map(runProg).filter((n) => n > 0)[0];
	
};

describe('bob', () => {	
	it('works for test case 1', () => {
		const input = `nop +0
acc +1
jmp +4
acc +3
jmp -3
acc -99
acc +1
jmp -4
acc +6`;

		assert.equal(solve(input), 8);
	});

	// it('works for test case 2', () => {
	// 	const input = `HERE`;

	// 	assert.equal(solve(input), 424242);
	// });

	// it('works for test case 3', () => {
	// 	const input = `HERE`;

	// 	assert.equal(solve(input), 424242);
	// });

	it('show the answer when ready!', () => {

		// const expected = 42;

		assert.equal(solve(puzzleInput), 'bob');
	});
});

