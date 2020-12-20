import { puzzleInput } from "./puzzle-input";
import { assert } from 'chai';

import { rotate, rotate90, hflip, vflip } from "2d-array-rotation";
import { createImportSpecifier, forEachChild, getSupportedCodeFixes } from "typescript";
import { writeFileSync } from "fs";
import { id } from "./utils";



const parseInput = (raw: string) => {
	const chunks = raw
		.split('\n\n');

	return chunks.map((chunk) => {


		const [id, ...rest] = chunk.split('\n');

		const grid = new Map();

		const mat = [];
		rest.forEach((row, y) => {
			mat.push([])
			row.trim().split('').forEach((cell, x) => {
				const value = cell;
				mat[y][x] = value;
			})
		});




		if (!id.match(/\d+/)[0]) {
			console.log({ id })
			throw 'wa';
		}


		return {
			id: id.match(/\d+/)[0],
			mat,
			initBo: calcBorders(mat)
		}
	});
}

const calcBorders = (mat) => {
	const bs = [[], [], [], []];
	for (let d = 0; d < 10; d++) {
		const v = mat[0][d];
		const v2 = mat[9][d];
		const v3 = mat[d][0];
		const v4 = mat[d][9];
		bs[0].push(v);
		bs[1].push(v2);
		bs[2].push(v3);
		bs[3].push(v4);
	}

	return bs.map(b => b.join(''));
}

const matches = (g1, g2) => {
	const matchBorder = (b1, b2) => {
		const s1 = b1;
		const s2 = b2;
		return s1 === s2 || s1.split('').reverse().join('') === s2;
	}

	const found = [];

	g1.initBo.forEach((border) => {
		g2.initBo.forEach(border2 => {
			if (matchBorder(border, border2)) {
				found.push([g1.id, g2.id]);
			}
		});
	})

	return found;
}

const properMatch = (g1, g2) => {

	const bo1 = calcBorders(g1.mat);
	const bo2 = calcBorders(g2.mat);
	const [t1, b1, l1, r1] = bo1.map(b => b);
	const [t2, b2, l2, r2] = bo2.map(b => b);
	if (t1 === b2) {
		return 't'
	} else if (b1 === t2) {
		return 'b'
	} else if (l1 === r2) {
		return 'l';
	} else if (r1 === l2) {
		return 'r';
	} else {
		return false
	}
}

const fixUntilMatches = (g1, g2) => {

	for (let i = 0; i < 4; i++) {
		if (!properMatch(g1, g2)) {
			g2.mat = rotate90(g2.mat);
		} else {
			return true;
		}
	}

	g2.mat = hflip(g2.mat);

	for (let i = 0; i < 4; i++) {
		if (!properMatch(g1, g2)) {
			g2.mat = rotate90(g2.mat);
		} else {
			return true;
		}
	}

	g2.mat = vflip(g2.mat);

	for (let i = 0; i < 4; i++) {
		if (!properMatch(g1, g2)) {
			g2.mat = rotate90(g2.mat);
		} else {
			return true;
		}
	}

	console.log(g1.id, g2.id);
	console.log(toStr(g1.mat));
	console.log(toStr(g2.mat));
	console.log('b1', calcBorders(g1.mat));
	console.log('b2', calcBorders(g2.mat));
	console.log(properMatch(g1, g2));
	throw 'no matching rotations';
}

const toStr = (mat) => mat.map((r) => r.join('')).join('\n');


export const solve = (raw: string): any => {
	const input = parseInput(raw);

	const findings = input.map((g1, i) => {
		const allm = input.map((g2, ii) => {
			if (g1 !== g2) {
				return { target: g2, matches: matches(g1, g2) };
			}
		}).filter((m) => !!m && m.matches.length > 0);

		return { ne: allm, g: g1 };
	});



	//order everything

	const queue = [findings[0]];

	const fixed = new Set();

	while (queue.length) {

		const { ne, g } = queue.pop();

		fixed.add(g.id);

		ne.forEach((target) => {
			fixUntilMatches(g, target.target);
		});

		const nexts = ne.map((n) => {
			return findings.find(({ g }) => g.id === n.target.id);
		});

		if (nexts.filter((v) => !v).length > 0) throw 'bob';



		queue.push(...nexts.filter((n) => !fixed.has(n.g.id)));
	}


	const first = findings.filter(({ ne }) => ne.length === 2)
		.filter((f) => {


			const m1 = properMatch(f.g, f.ne[0].target);
			const m2 = properMatch(f.g, f.ne[1].target);
			return (m1 === 'b' || m2 === 'b') && (m1 === 'r' || m2 === 'r');
		});

	if (first.length !== 1) throw 'more than one corner';


	const cutCorners = (mat) => {

		// const newM = [];
		// for (let y = 0; y < mat.length; y++) {
		// 	for (let x = 0; x < mat[0].length; x++) {
		// 		if (y !== 0 && y !== mat.length - 1) {
					
		// 			if (x !== 0 && x !== mat[0].length - 1) {
		// 				const ry = y - 1;
		// 				newM[ry] = newM[ry] || [];
		// 				const rx = x - 1;
		// 				newM[ry][rx] = mat[ry][rx]
		// 			}
		// 		}
		// 	}
		// }

		// return newM;
		return mat.map((row) => {
			return row.filter((_, i) => i !== 0 && i !== mat.length - 1)
		}).filter((_, i) => i !== 0 && i !== mat[0].length - 1)


	}


	const newMat = [];
	const visited = new Set();
	const run = (f: typeof findings[0], pos) => {
		const [x, y] = pos;

		visited.add(f.g.id);
		if (!newMat[y]) newMat[y] = [];

		const cc = cutCorners(f.g.mat);
		console.log(toStr(cc), '\n');
		newMat[y][x] = cutCorners(f.g.mat);

		f.ne.forEach((n) => {

			const m = properMatch(f.g, n.target);

			if (visited.has(n.target.id)) {
				return;
			}

			const ff = findings.find((f) => f.g.id === n.target.id);
			if (m === 't') {
				run(ff, [x, y - 1]);
			} else if (m === 'b') {
				run(ff, [x, y + 1]);
			} else if (m === 'l') {
				run(ff, [x - 1, y]);
			} else if (m === 'r') {
				run(ff, [x + 1, y]);
			} else {
				throw 'bad match'
			}
		});
	}

	run(first[0], [0, 0]);


	const h = newMat.length;
	const w = newMat[0].length;

	const image = [];

	for (let cx = 0; cx < w; cx++) {
		for (let cy = 0; cy < h; cy++) {
			const chunk = newMat[cy][cx];

			const ch = chunk.length;
			const cw = chunk[0].length;

			for (let y = 0; y < ch; y++) {
				for (let x = 0; x < cw; x++) {

					const realX = cx * cw + x;
					const realY = cy * ch + y;

					const v = chunk[y][x];

					if (!image[realY]) image[realY] = [];
					image[realY][realX] = v;

				}
			}
		}

	}

	writeFileSync('./bob.txt', toStr(image));
	const seaMonster = `                  # 
#    ##    ##    ###
 #  #  #  #  #  #   `.split('\n').map(r => r.split(''));
	
	const findMonsters = (_img) => {

		
		const img = [..._img.map(r => ([...r]))];
		const h = img.length;
		const w = img[0].length;
		const mh = seaMonster.length;
		const mw = seaMonster[0].length;

		let foundSet = new Set();

		let bobs = 0;
		img.forEach(r => r.forEach(c => {
			if (c === '#') {
				bobs++;
			}
		}));

		let total = 0;
		for (let y = 0; y < h - mh; y++) {
			for (let x = 0; x < w - mw; x++) {


				let found = true;

				const ts = [];

				for (let my = 0; my < mh; my++) {
					for (let mx = 0; mx < mw; mx++) {

						// console.log({x: x + mx, y: y + my, w, h, mh, mw})

						const rx = x + mx;
						const ry = y + my;
						const v = img[ry][rx];
						const m = seaMonster[my][mx];

						if (!m) {
							console.log({v, m, mx, my, x, y, mh, mw});
						}


						if (m === '#' && v === '#') {
							ts.push(id({x: rx, y: ry}));
						} else if (m === '#') {
							// console.log('broken on')
							found = false;
						}

					}
				}
				if (found) {
					ts.forEach(id => foundSet.add(id));
					total++;
				}
			};
		};


		

		

		return {total, bobs, rs: bobs - foundSet.size, fs: foundSet.size};
	}

	let _im = image;

	const functs = [rotate90, rotate90, rotate90, rotate90, hflip, rotate90, rotate90, rotate90, rotate90, vflip];


	let f = -1;
	functs.forEach((fn) => {
		const found = findMonsters(_im);
		_im = fn(_im);
		console.log(found.total);

		if (found.total > 0) {
			f = found.rs;
			console.log({found});
		}
	});

	return f;

	


	// while (found )

	// console.log(found);



	// console.log(toStr(image));


	// console.log(newMat)



	// return findings.filter(({ne}) => ne.length === 2).reduce((a, p) => {
	// 	// return a * parseInt(p.id);

	// }, 1);



	return input.length;
};

describe('bob', () => {
	it('works for test case 1', () => {
		const input = `Tile 2311:
..##.#..#.
##..#.....
#...##..#.
####.#...#
##.##.###.
##...#.###
.#.#.#..##
..#....#..
###...#.#.
..###..###

Tile 1951:
#.##...##.
#.####...#
.....#..##
#...######
.##.#....#
.###.#####
###.##.##.
.###....#.
..#.#..#.#
#...##.#..

Tile 1171:
####...##.
#..##.#..#
##.#..#.#.
.###.####.
..###.####
.##....##.
.#...####.
#.##.####.
####..#...
.....##...

Tile 1427:
###.##.#..
.#..#.##..
.#.##.#..#
#.#.#.##.#
....#...##
...##..##.
...#.#####
.#.####.#.
..#..###.#
..##.#..#.

Tile 1489:
##.#.#....
..##...#..
.##..##...
..#...#...
#####...#.
#..#.#.#.#
...#.#.#..
##.#...##.
..##.##.##
###.##.#..

Tile 2473:
#....####.
#..#.##...
#.##..#...
######.#.#
.#...#.#.#
.#########
.###.#..#.
########.#
##...##.#.
..###.#.#.

Tile 2971:
..#.#....#
#...###...
#.#.###...
##.##..#..
.#####..##
.#..####.#
#..#.#..#.
..####.###
..#.#.###.
...#.#.#.#

Tile 2729:
...#.#.#.#
####.#....
..#.#.....
....#..#.#
.##..##.#.
.#.####...
####.#.#..
##.####...
##..#.##..
#.##...##.

Tile 3079:
#.#.#####.
.#..######
..#.......
######....
####.#..#.
.#...#.##.
#.#####.##
..#.###...
..#.......
..#.###...`;

		assert.equal(solve(input), 273);
		// assert.equal(solve(input), 20899048083289);
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

