// import { puzzleInput } from "../lib/lib";
import {assert} from 'chai';
import { readFileSync, writeFileSync } from 'fs';
import { getTestCases } from '../runtime/lib/get-tests';
import { readInputFile } from '../runtime/lib/input-output-files';
import { createGrid, delay, vectorAdd } from './utils';

const rocksStr = `####

.#.
###
.#.

..#
..#
###

#
#
#
#

##
##`.split('\n\n')

const rocks = rocksStr.map((str) => {
	const bobs=  str.split('\n').map((line, y) => {
		return line.split('').map((char, x) => {
			if (char === '#') {
				return {x, y}
			} else {
				return null
			}
		}).filter(id => !!id);
	})
	return bobs.reduce((acc, curr) => acc.concat(...curr), []);
});


export const solve = (raw: string): any => {
	const jets = raw.split('').map((c) => c === '>' ? 1 : -1)

	console.log(jets);
	

	const width = 7;

	console.log(rocks);
	



	const grid = createGrid();

	for (let x = 0; x < width; x++) {
		grid.set({x, y: 0}, '#');
	}

	let currRock = 0;


	const spawn = (spawnY) => {
		const rock = rocks[currRock].map(i => i);
		let i = currRock;
		currRock = (currRock + 1) % rocks.length;

		const ys = rock.map(r => r.y);
		const height = Math.max(...ys);

		const diff = spawnY - height - 1;

		const r=  rock.map((pos) => {
			return {x: pos.x + 2, y: pos.y + diff}
		})
		return {r, idx: i};
	}

	let currJet = 0;
	const nextJet = () => {
		const v = jets[currJet];
		currJet = (currJet + 1) % jets.length;
		return v;
	}

	const moveOne = (rock, vector) => {
		const xs = rock.map(r => r.x);
		const mostLeft = Math.min(...xs);
		const mostRight = Math.max(...xs);

		const potential = rock.map(pos => vectorAdd(pos, vector));

		if (potential.some(pos => grid.get(pos) === '#')) {
			return {rock, blocked: true};
		}

		if (mostLeft === 0 && vector.x === -1) {
			return {rock, blocked: true};
		} else if (mostRight === width - 1 && vector.x === 1) {
			return {rock, blocked: true};
		} else {
			return {rock: potential, blocked: false}
		}
	}

	const isStopped = (rock) => {
		return rock.some((pos) => {
			return pos.y === 0 || grid.get({...pos, y: pos.y + 1}) === '#';
		})
	}

	const merge = (rock) => {
		rock.forEach(pos => grid.set(pos, '#'));
	}

	const getTallest = (rock) => {
		return Math.min(...rock.map(r => r.y));
	}

	const print = (rock) => {
		// const g = grid.copy();
		// rock.forEach(r => g.set(r, '@'));
		// g.print();
	}

	let total = 0;

	let tallest = 0;

	let combos = new Map();

	let yo = 0;
	let yo2 = 0;

	const reps = 2781;

	const repsTotal = 1750;

	const mol = 571428571

	// highest = 2781 
	// every 1750

	const series = readFileSync('./series.txt', 'utf-8').split('\n').map(r => r.split(',').map(Number));

	const findReal = (toFind) => {
		while (total < toFind) {

			let bob = spawn(tallest - 3);
			let rock = bob.r;
	
	
			if (total  >= 1800) {
				series.push([total, tallest])
			}
	
			// const k = `${bob.idx},${currJet}`;
			// const cv = combos.get(k) || 0;
			
			// if (cv > yo) {//} && yo2++ > 2) {
			// 	console.log(yo, total, tallest);
			// 	yo = cv;
			// 	yo2=0;
			// 	// break;
			// }
			// combos.set(k,cv + 1);
			total++;
	
	
			while(true) {
				const jet = nextJet();
				rock = moveOne(rock, {x: jet, y:0}).rock;
	
				print(rock);
	
				const res = moveOne(rock, {x: 0, y: 1});
	
				rock = res.rock;
				print(rock);
	
				if (res.blocked) {
					const mt = getTallest(rock);
					if (tallest > mt) {
						// console.log('tallest', tallest);
						
						tallest = mt;
					}
					merge(rock)
					break;
				}
			}
	
			// break;
	
			// console.log(Math.abs(tallest), total)
		}
		return Math.abs(tallest);
	}

	const find = (toFind) => {
		if (toFind > 1800) {
			

			const start = toFind - 1800;

			const n = Math.floor(start / 1750);
			const extraCycles = start % 1750;

			const heighest = series[extraCycles][1]

			console.log({heighest, n, start});
			

			return heighest + (n * -2781);
			
		} else {
			return findReal(toFind);
		}
	}

	return find(1000000000000)

	

	// writeFileSync('./series.txt', series.map(i => i.join(',')).join('\n'));

	/*
	Each rock appears so that its left edge is two units away from the left wall and its bottom
	edge is three units above the highest rock in the room (or the floor, if there isn't one).
	*/
	

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
