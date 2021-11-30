import { puzzleInput } from "./puzzle-input";
import {assert} from 'chai';
import { setCell } from "./utils";


const parseInput = (raw: string) => {
	const [conditions, your, nearby] = raw.split('\n\n');

	console.log(nearby);

	const conds = conditions.split('\n').map((cond) => {
		const [key, rest] = cond.split(': ');
		const [c1, c2] = rest.split(' or ');
		const [c1a, c1b] = c1.split('-').map(Number);
		const [c2a, c2b] = c2.split('-').map(Number);
		return { key, r1: [c1a, c1b], r2: [c2a, c2b]};
	})
	
	const nea = nearby.replace('nearby tickets:\n', '').split('\n').map((r) => {
		return r.split(',').map(Number);
	});

	const myTicket = your.replace('your ticket:\n', '').split('\n').map((r) => {
		return r.split(',').map(Number);
	})[0];

	return {conds, nearby: nea, myTicket};
}

export const solve = (raw: string): any => {
	const input = parseInput(raw);

	let bob = 0;
	const inRange = (n, [r1, r2]: any) => {
		return n >= r1 && n <= r2;
	};

	const validTickets = input.nearby.filter((r) => {
		return r.every((c) => {


			let invalid = 0;
			input.conds.forEach(cond => {

				const ok = inRange(c, cond.r1) || inRange(c, cond.r2);
				if (!ok) {
					invalid++;
				} else {
					// console.log('bad', c);
				}
			});

			return (invalid !== input.conds.length)
		})
	});

	// console.log(validTickets.length)

	const allTickets = [input.myTicket, ...validTickets];

	const validOrders = new Map();


	const ticketL = allTickets[0].length;

	// console.log(ticketL);


	for (let c = 0; c < input.conds.length; c++) {

		const {key, r1, r2} = input.conds[c];

		// console.log({key});

		let validPostions = [];

		for (let tn = 0; tn < ticketL; tn++) {

			let valid = true;

			for (let t = 0; t < allTickets.length; t++) {
				const c = allTickets[t][tn];
				
				const v = inRange(c, r1) || inRange(c, r2);
				if (!v) {
					valid = false;
					break;
				}
			}

			if (valid) {
				validPostions.push(tn);
				// console.log(tn, key);
			}
		}

		if (!validPostions) {
			console.log(key)
		}
		validOrders.set(key, validPostions);
	}


	let more = true;

	while (more) {

		more = false;

		Array.from(validOrders.entries()).forEach(([k, v]) => {

			// console.log(v);
			if (v.length > 1) {
				more = true;
			}
			if (v.length === 1) {
				const f = v[0];
				Array.from(validOrders.entries()).forEach(([kk, vv]) => {
					if (k !== kk) {
						
						const nv = vv.filter((a) => a !== f);
						if (nv.length < 1 ) throw 'wat';

						validOrders.set(kk, nv);
					}
				})
			}
		})
		
	}

	console.log(validOrders);

	return Array.from(validOrders.keys()).filter(k => k.includes('departure'))
		.map(k => {
			const i = validOrders.get(k)[0];
			return input.myTicket[i];
		})
		.reduce((a, c) => a * c, 1);




	return bob;
};

describe('bob', () => {	
	it('works for test case 1', () => {
		const input = `class: 0-1 or 4-19
row: 0-5 or 8-19
seat: 0-13 or 16-19

your ticket:
11,12,13

nearby tickets:
3,9,18
15,1,5
5,14,9`;

		// assert.equal(solve(input).class, 12);
		// assert.equal(solve(input).row, 11);
		// assert.equal(solve(input).seat, 13);
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

