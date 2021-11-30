import { puzzleInput } from "./puzzle-input";
import {assert} from 'chai';
import { setCell } from "./utils";

const consolidate = (n) => {


	const map = new Map();

	const get = (d) => map.get(d) || 0;
	const inc = (d) => {map.set(d, get(d) + 1)}
	const dec = (d) => {map.set(d, get(d) - 1)}

	const combos = {
		'n+s': '',
		'ne+sw': '',
		'nw+se': '',
		'ne+nw': 'n',
		'se+sw': 's',
		'ne+s': 'se',
		'nw+s': 'sw',
		'se+n': 'ne',
		'sw+n': 'nw',
	};

}


const parseInput = (raw: string) => {
	const rows = raw
		.split('\n')
		.map(n => n.trim())
		.filter((v) => !!v)
		.map((r) => {

			const bobs = 'e, se, sw, w, nw, ne'.split(', ');
			const fn: any = (ma, a) => {
				// console.log(ma, a);
				return bobs.indexOf(a)
			};
			const p1 = r.replace(/(e|se|sw|w|nw|ne)/g, fn);

			const p2 = p1.split('');

			return p2.map((p) => bobs[p]);
		})

	// const grid = new Map();
	// rows.forEach((row, y) => {
	// 	row.split('').forEach((cell, x)  => {
	// 		const value = cell;
	// 		setCell({x, y}, value, grid);
	// 	})
	// }
	return rows;
}

export const solve = (raw: string, totalDays = 100): any => {
	const input = parseInput(raw);
	//const bobs = 'e, se, sw, w, nw, ne'.split(', ');



	const orgCombos  = {
		'n+s': '',
		'ne+sw': '',
		'nw+se': '',

		'ne+nw': 'n',
		'se+sw': 's',
		'ne+s': 'se',
		'nw+s': 'sw',
		'se+n': 'ne',
		'sw+n': 'nw',
	};

	const combos = {
		'w+e': '',
		'ne+sw': '',
		'nw+se': '',

		'ne+se': 'e',
		'nw+sw': 'w',
		'ne+w': 'nw',
		'nw+e': 'ne',
		'se+w': 'nw',
		'sw+e': 'ne',
	}


	const combosTrans = {
		'w+e': 'X',
		'ne+sw': 'X',
		'nw+se': 'X',

		'ne+se': 'e+X',
		'nw+sw': 'w+X',
		'ne+w': 'nw+X',
		'nw+e': 'ne+X',
		'se+w': 'nw+X',
		'sw+e': 'ne+X',
	}
	

	const trans1 = {
		'se+nw': 'X+X',
		'ne+sw': 'X+X',
		'w+e': 'X+X',
		'nw+sw': 'w+X',
		'ne+se': 'e+X',
		'se+w': 'sw+X',
		'sw+e': 'se+X',
		'ne+w': 'nw+X',
		'nw+e': 'ne+X'
	};

	const norm = (_row, trans: any) => {
		const pairs: any = Object.entries(trans).map(([k, v]) => {
			return {from: k.split('+'), to: (v as any).split('+')} as any
		});
	
		const row = [..._row];
		let found = pairs.filter(({from}) => row.includes(from[0]) && row.includes(from[1]))[0];

		while (found) {
			const [s, t] = found.from;
			const i1 = row.indexOf(s);
			const i2 = row.indexOf(t);


			row[i1] = found.to[0];
			row[i2] = found.to[1];

			found = pairs.filter(({from}) => row.includes(from[0]) && row.includes(from[1]))[0];
		}

		const ret =  row.filter((r) => r !== 'X');

		return ret.sort();
	}

	const tiles = input.map(r => norm(r, trans1))

	const initState = new Map();
	tiles.forEach((_r) => {
		const r = _r.join(',')
		initState.set(r, (initState.get(r) || 0) + 1)
	});

	let currState = new Map(initState);


	const mem = new Map();

	const runDay = () => {

		const newState = new Map(currState);

		const neighbours = (tile) => {
			if (!mem.get(tile.join(','))) {

				const n1 = ['e', 'w', 'ne', 'nw', 'se', 'sw'].map((t) => [...tile, t]);
				// console.log(n1, tile);
				const n2 = n1.map(n => norm(n, trans1));
				// return n2;
				mem.set(tile.join(','), n2);
			} else {
				// console.log('hit');
			}
			return mem.get(tile.join(','));
		}

		const countBlacks = (tile) => {
			const ne = neighbours(tile);

			const blacks = ne.filter((tile) => {
				const c = currState.get(tile.join(',')) || 0;
				// console.log(c);
				return c % 2 === 1;
			});

			return blacks.length;
		}


		const normArr = s => s.filter(s => !!s);
		const toCheckRaw = Array.from(currState.keys())
			.reduce((all, curr) => {
				const tiles = normArr(curr.split(','));
				const ne = neighbours(tiles);
				return [...all, tiles, ...ne];
			}, []).map(r => r.join(','))

			
		const toCheck = Array.from(new Set(toCheckRaw)).map((r: any) => normArr(r.split(',')));
			
		// console.log('bob', toCheckRaw.length);
		// console.log('going to check', toCheck.length);


		// console.log(toCheck);
		toCheck.forEach((tile) => {

			const tk = tile.join(',');
			const curr = currState.get(tk) || 0;
			const blacks = countBlacks(tile);

			if (curr % 2 === 1 ) {
				if (blacks === 0 || blacks > 2) {
					newState.set(tk, curr + 1);
				}
			} else {
				if (blacks === 2) {
					newState.set(tk, curr + 1);
				}
			}
		});

		currState = newState;
	}

	for (let d = 0; d < totalDays; d++ ) {
		const c1 = Array.from(currState.values()).filter((n) => n % 2 === 1).length
		// console.log('blck state before', c1);

		console.log('running d', d);
		runDay();

		const c2 = Array.from(currState.values()).filter((n) => n % 2 === 1).length
		// console.log('blck state after', c2);

	}

	// const bobs = Array.from(m.entries()).filter(([k,v]) => {
	// 	// console.log(v)
	// 	return v === 1;
	// 	if (k === 1) {
	// 		return v;
	// 	}
	// })

	/*
	Any black tile with zero or more than 2 black tiles immediately adjacent to it is flipped to white.
Any white tile with exactly 2 black tiles immediately adjacent to it is flipped to black.

	*/

	// console.log(bobs);
	// console.log(m);

	return Array.from(currState.values()).filter((n) => n % 2 === 1).length
};

describe('bob', () => {	
	it('works for test case 1', () => {
		const input = `sesenwnenenewseeswwswswwnenewsewsw
neeenesenwnwwswnenewnwwsewnenwseswesw
seswneswswsenwwnwse
nwnwneseeswswnenewneswwnewseswneseene
swweswneswnenwsewnwneneseenw
eesenwseswswnenwswnwnwsewwnwsene
sewnenenenesenwsewnenwwwse
wenwwweseeeweswwwnwwe
wsweesenenewnwwnwsenewsenwwsesesenwne
neeswseenwwswnwswswnw
nenwswwsewswnenenewsenwsenwnesesenew
enewnwewneswsewnwswenweswnenwsenwsw
sweneswneswneneenwnewenewwneswswnese
swwesenesewenwneswnwwneseswwne
enesenwswwswneneswsenwnewswseenwsese
wnwnesenesenenwwnenwsewesewsesesew
nenewswnwewswnenesenwnesewesw
eneswnwswnwsenenwnwnwwseeswneewsenese
neswnwewnwnwseenwseesewsenwsweewe
wseweeenwnesenwwwswnew`;
		// assert.equal(solve(input, 1), 15);
		// assert.equal(solve(input, 2), 12);
		// assert.equal(solve(input, 3), 25);
		assert.equal(solve(input), 2208);
	});

	// it('works for test case 2', () => {
	// 	const input = `HERE`;

	// 	assert.equal(solve(input), 424242);
	// });

	it('show the answer when ready!', () => {

		// const expected = 42;

		// assert.equal(solve(puzzleInput), 'bob');
	});
});

