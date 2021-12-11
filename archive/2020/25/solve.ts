import { puzzleInput } from "./puzzle-input";
import {assert} from 'chai';
import { setCell } from "./utils";


const parseInput = (raw: string) => {
	const rows = raw
		.split('\n')
		.map(n => n.trim())
		.filter((v) => !!v)
		.map(Number);

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
	const [card, door] = parseInput(raw);

	/*
	The card transforms the subject number of 7 according to the card's secret loop size. The result is called the card's public key.
	The door transforms the subject number of 7 according to the door's secret loop size. The result is called the door's public key.
	The card and door use the wireless RFID signal to transmit the two public keys (your puzzle input) to the other device. Now, the card has the door's public key, and the door has the card's public key. Because you can eavesdrop on the signal, you have both public keys, but neither device's loop size.
	The card transforms the subject number of the door's public key according to the card's loop size. The result is the encryption key.
	The door transforms the subject number of the card's public key according to the door's loop size. The result is the same encryption key as the card calculated.

	
*/

	const DIV = 20201227;

	const run = (sub, loops) => {
		let val = 1;
		for (let i = 0; i < loops; i++) {
			val =  val * sub;
			val = val % DIV;
		}
		return val;
	}
	const calcLoop = (target) => {
		let sub = 7;
		let val = 1;

		let loop = 0;
		while (val !== target) {
			val =  val * sub;
			val = val % DIV;
			loop++;
		}

		return loop;

		// Set the value to itself multiplied by the subject number.
	// Set the value to the remainder after dividing the value by 20201227.
	}

	const l1 = calcLoop(card);
	const l2 = calcLoop(door);
	console.log(run(7, 8));
	console.log(run(card, 11));
	console.log(run(door, 8));


	return run(door, l1);
};

describe('bob', () => {	
	it('works for test case 1', () => {
		const input = `5764801
17807724`;

		assert.equal(solve(input), '14897079');
	});

	// it('works for test case 2', () => {
	// 	const input = `HERE`;

		// assert.equal(solve(input), 424242);
	// });

	it('show the answer when ready!', () => {

		// const expected = 42;

		assert.equal(solve(puzzleInput), 'bob');
	});
});

