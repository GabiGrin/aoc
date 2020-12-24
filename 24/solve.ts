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

export const solve = (raw: string): any => {
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

	const trans2 = {

	}

	
	const norm = (_row, trans: any) => {
		const pairs: any = Object.entries(trans).map(([k, v]) => {
			return {from: k.split('+'), to: (v as any).split('+')} as any
		});
	
		console.log(pairs);
		// se se nw ne ne ne w se e sw w sw sw w ne ne w se w sw
		// se X[se nw] ne ne ne w se Xe sw Xw sw sw w ne ne w se w sw
		const row = [..._row];

		console.log(row);

		let found = pairs.filter(({from}) => row.includes(from[0]) && row.includes(from[1]))[0];

		while (found) {
			const [s, t] = found.from;
			const i1 = row.indexOf(s);
			const i2 = row.indexOf(t);


			row[i1] = found.to[0];
			// if (s.length === 2) row[i1 + 1] = 'X';
			
			// row[i2] = 'X';
			row[i2] = found.to[1];
			// row[i2] = 'X';
			// if (t.length === 2) row[i2 + 1] = 'X';

			found = pairs.filter(({from}) => row.includes(from[0]) && row.includes(from[1]))[0];
		}

		const ret =  row.filter((r) => r !== 'X');

		console.log(ret);
		return ret;
	}

	const norms = input.map(r => norm(r, trans1))
		// .map((r) => norm(r, trans2))
		.map(r => r.sort().join(','));

	const m = new Map();
	const times = norms.forEach((r) => {
		m.set(r, (m.get(r) || 0) + 1)
	});

	const bobs = Array.from(m.entries()).filter(([k,v]) => {
		// console.log(v)
		return v === 1;
		if (k === 1) {
			return v;
		}
	})

	console.log(bobs);
	console.log(m);

	return Array.from(m.values()).filter((n) => n % 2 === 1).length
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

		assert.equal(solve(input), 10);
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

