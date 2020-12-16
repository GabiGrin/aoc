import { puzzleInput } from "./puzzle-input";
import {assert} from 'chai';
import { setCell } from "./utils";


const parseInput = (raw: string) => {
	const rows = raw
		.split(',')
		.map(n => n.trim())
		.filter((v) => !!v)
		.map(Number);

	console.log(rows);
	return rows;
}

export const solve = (raw: string, maxTurn = 2020): any => {
	const input = parseInput(raw);


	// let lasts = [];

	let turn = 1;

	let lastNum = -1;

	// const ser = [];

	let shards = [];

	const shardSize = 10000;

	const getLasts = (num) => {
		// const shardNum = Math.floor(num / shardSize);
		// const lasts = shards[shardNum] || [];
		// const offset = shardNum * shardSize;
		// return lasts[num - offset] || [];

		return shards[num] || [];
	}

	const addToLasts = (num, turn) =>{ 
		// const shardNum = Math.floor(num / shardSize);
		// const lasts = shards[shardNum] || [];
		// const offset = shardNum * shardSize;

		// const curr = lasts[num - offset] || [];
		// lasts[num - offset] = [turn, ...curr.slice(0)];
		// shards[shardNum] = lasts;

		const curr = shards[num] || []
		shards[num] = [turn, ...(curr.length? [curr[0]] : [])];
	}


	input.forEach((n, i) => {
		addToLasts(n, i + 1);
		lastNum = n;
		// ser.push(lastNum);
		turn++;
	});


	let dave = 0;

	
	while (turn <= maxTurn) {

		const b = getLasts(lastNum);
		let res;
		// console.log({b, t});
		if (b.length > 1) {
			const [last, preLast] = b;
			res = last - preLast;
			// console.log (last, preLast);
		} else {
			if (b.length === 1) {
				// console.log('new number!', turn, lastNum);
			}
			// console.log('new number', lastNum);
			res = 0;
		}

		

		addToLasts(res, turn);
		lastNum = res;
		// console.log('spoke ', {lastNum, turn});

		
		if (turn % 412 === 0) {
			// console.log(turn);
		}
		if (res > 412 && res % 412 === 0) {
			// console.log({res, turn});
			// console.log(lasts.size, 'size');
			// console.log('1043, 1000th hope', turn, turn- dave);
			dave = turn
		}

		if (turn % 100000 === 0) {
			console.log('turn', turn, lastNum);
		}

		// ser.push(lastNum);
		turn++;
	}


	return lastNum;
};

describe('bob', () => {	
	it('works for test case 1', () => {
		const input = `0,3,6`;

		// assert.equal(solve(input, 5), 3);
		// assert.equal(solve(input, 6), 3);
		// assert.equal(solve(input, 7), 1);
		// assert.equal(solve(input), 436);
		assert.equal(solve(input, 5001), 17);
	});

	// it('works for test case 2', () => {
	// 	const input = `HERE`;

	// 	assert.equal(solve(input), 424242);
	// });

	it('show the answer when ready!', () => {

		// const expected = 42;

		// assert.equal(solve(puzzleInput, 1000), 'bob');
	});
});

