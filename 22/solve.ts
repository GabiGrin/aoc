import { puzzleInput } from "./puzzle-input";
import {assert} from 'chai';

const parseInput = (raw: string) => {
	const rows = raw
		.split('\n\n');

	const players = rows.map((r) => {
		const [, ...scores] = r.split('\n');
		return scores.map(Number);
	});
		
	return {p1: players[0], p2: players[1]};
}

export const solve = (raw: string): any => {
	const original = parseInput(raw);

	const playGame = (p1, p2) => {
		const visitedCards = new Set();

		const addVisited = (p1, p2) => visitedCards.add(p1.join(',') + '|' + p2.join(','));
		const hasVisited = (p1, p2) => visitedCards.has(p1.join(',') + '|' + p2.join(','));

		while (p1.length > 0 && p2.length > 0) {
			if (hasVisited(p1, p2)) {
				return ['p1', p1];
			} 
			addVisited(p1, p2);

			const n1 = p1.shift();
			const n2 = p2.shift();

			if (p1.length >= n1 && p2.length >= n2) {
				const d1 = p1.slice(0, n1);
				const d2 = p2.slice(0, n2);

				const winner = playGame(d1, d2);

				if (winner[0] === 'p1') {
					p1.push(n1, n2);
				} else if (winner[0] === 'p2') {
					p2.push(n2, n1);
				} else {
					throw 'wa'
				}
			} else {
				if (n1 > n2) {
					p1.push(n1, n2);
				} else if (n2 > n1) {
					p2.push(n2, n1);
				} else {
					throw 'wa'
				}
			}
		}

		if (p1.length > 0) {
			return ['p1', p1]
		} else {
			return ['p2', p2];
		}
	}

	const [w, deck] = playGame(original.p1, original.p2);

	return deck.reverse().map((n, i) => n * (i + 1)).reduce((a, p) => a+ p, 0);
};

describe('bob', () => {	
	it('works for test case 1', () => {
		const input = `Player 1:
9
2
6
3
1

Player 2:
5
8
4
7
10`;

		assert.equal(solve(input), 291);
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

