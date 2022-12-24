// import { puzzleInput } from "../lib/lib";
import {assert} from 'chai';
import { create } from 'domain';
import { posix } from 'path';
import { addSyntheticLeadingComment } from 'typescript';
import { getTestCases } from '../runtime/lib/get-tests';
import { readInputFile } from '../runtime/lib/input-output-files';
import { calcNeighbours, createGrid, dirs, Vector } from './utils';

const map =
	{'^': 'U',
	'v': 'D',
	'>': 'R',
	'<': 'L'
};
const parseInput = (raw: string) => {
	
	const blizzards: {dir: keyof (typeof dirs), pos: Vector, original: string}[] = [];
	let entry;
	let exit;
	let height;
	let width;
	const grid = createGrid();
	raw
		.split('\n')
		.map((r, y, arr) => {
			return r.split('').map((c, x, row) => {
				if (c === '#') {
					grid.set({x, y}, c)
				} else {
					grid.set({x, y}, '.');
				}

				if (y === 0 && c === '.') {
					entry = {x, y};
				} else if (y === arr.length - 1) {
					if (c === '.') {
						exit = {x, y}
					}
					// grid.set({x, y}, c)
					height = arr.length;
				} else if (c !== '.' && c !== '#') {
					const transformed = map[c] || c;
					blizzards.push({dir: transformed, pos: {x, y}, original: c})
				} else {
					grid.set({x, y}, c)
				}
				width = row.length;
			});
		})
	return {entry, exit, height, blizzards, width: width, grid};
}


export const solve = (raw: string): any => {
	const {entry, exit, height, width, blizzards: fBz, grid} = parseInput(raw);

	const blizDirs = fBz.map(b => b.dir);
	const blizzards = fBz.map(b => b.pos);

	const kVec = (v: Vector) => `${v.x},${v.y}`;
	


	const roundOfBlizzards = (bliz: typeof blizzards): typeof blizzards => {
		return bliz.map((b, i) => {
			const fn = dirs[blizDirs[i]];
			const next = fn(b);
			if (next.x >= width - 1) {
				next.x = 1;
			} else if (next.x < 1) {
				next.x = width - 2;
			}

			if (next.y >= height - 1) {
				next.y = 1;
			} else if (next.y < 1) {
				next.y = height - 2;
			}
			return next;
		})
	}

	const blizzes = [];
	const blizviz = new Set();

	let curbiz = [...blizzards];
	while (true) {
		const k = curbiz.map(kVec).join('|');
		if (blizviz.has(k)) {
			break;
		}
		blizviz.add(k);
		blizzes.push(curbiz)
		curbiz = roundOfBlizzards(curbiz);
		// break;
	}
	const cycle = blizzes.length;

	const getBlizForMin = (min) => {
		return blizzes[min % cycle];
	}
	

	const print = (e: Vector, blizzards: any) => {
		const g = grid.copy();
		g.set(e, 'E');
		blizzards.forEach(p => g.set(p.pos, p.original));
		return g.toString()
	}


	let queue = [{exp: entry, mins: 0, t: 0}];

	const viz = new Set();

	const k = (v: Vector, blz: any[], t: number) => `${kVec(v)}|${t}|${blz.map((p, i) => `${i}:${kVec(p)}`)}`;

	let i = 0;

	let max =0;

	
	const targets = [exit, entry, exit];
	while(queue.length) {

		if (i++ % 1000 === 0) {
			console.log(i, queue.length);
		}
		const {exp, mins, t} = queue.shift();

		if (max > t) {
			continue;
		}

		const blizzards = getBlizForMin(mins);
		const hit = blizzards.find(b => b.x === exp.x && b.y === exp.y);
		if (hit) {
			console.log('opt hit!', exp, mins);
			continue;
		}

		const bz = roundOfBlizzards(blizzards);

		if (exp.x === targets[t].x && exp.y === targets[t].y) {

			max = t + 1;

			console.log('FOUND ONE', t, mins);
			
			queue = []
			viz.clear();
			if (t === 2) {
				return mins;
			}

			queue.push({exp, t: t + 1, mins: mins + 1});

			
			if (!targets.length) {
				console.log(mins);
				
				return mins;
			}
			continue;
		}

		const opts = [exp, ...calcNeighbours(exp)]
			.filter((pos) => {
				return pos.x >= 0 && pos.x <= width - 1
				 && pos.y >= 0 && pos.y <= height - 1
			})
			.filter((pos) => {
				const val = grid.get(pos);
				if (val === '#') {
					return false
				}
				return val !== '#';
			})
			.filter(pos => {
				return !bz.find(b => b.x === pos.x && b.y === pos.y)
			})
			.filter(pos => {
				return !viz.has(k(pos, bz, t));
			})

		opts.forEach((opt) => {
			const next = {exp: opt, mins: mins + 1, t};

			if (max >= t) {
				viz.add(k(opt, bz, t));
				queue.push(next)
			}
		})
	}
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
			// assert.equal(actual, case2.expected);
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
