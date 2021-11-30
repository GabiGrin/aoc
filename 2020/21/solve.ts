import { puzzleInput } from "./puzzle-input";
import {assert} from 'chai';
import { setCell } from "./utils";
import { resolveSoa } from "dns";


const parseInput = (raw: string) => {
	const rows = raw
		.split('\n')
		.map(n => n.trim())
		.filter((v) => !!v)
		.map((r) => {
			const [,ing, limit] = r.match(/([a-z\s]+)\s\(contains (.*)\)/);
			
			return {ing: ing.split(' '), limit: limit.split(', ')};
		})
		// .map(Number);

	// const grid = new Map();
	// rows.forEach((row, y) => {
	// 	row.split('').forEach((cell, x)  => {
	// 		const value = cell;
	// 		setCell({x, y}, value, grid);
	// 	})
	// }

	rows.sort((a, b) => {
		if (a.limit.length > b.limit.length) {
			return 1;
		} else if (a.limit.length < b.limit.length) {
			return -1;
		} else {
			return a.ing.length > b.ing.length ? 1 : a.ing.length === b.ing.length ? 0 : -1;
		}
	})

	// console.log(rows);
	return rows;
}

export const solve = (raw: string): any => {
	const input = parseInput(raw);


	const limitToIng = new Map();
	const ingToToLimit = new Map();



	input.forEach(inp => {
		inp.ing.forEach((ing) => {
			inp.limit.forEach((limit) => {

				const limitSet = limitToIng.get(limit) || new Set();
				const ingSet = ingToToLimit.get(ing) || new Set();

				limitSet.add(ing);
				ingSet.add(limit);

				limitToIng.set(limit, limitSet);
				ingToToLimit.set(ing, ingSet);
			})
		})
	});

	const allOpts = new Map();

	const allIngs = Array.from(ingToToLimit.keys());
	const allLimits = Array.from(limitToIng.keys());

	allIngs.forEach((ing) => {
		allLimits.forEach((limit) => {
			const s = allOpts.get(ing) || new Set();
			s.add(limit);
			allOpts.set(ing, s)
		});
	});

	console.log(allOpts);


	input.forEach((inp) => {

		const safeIng = allIngs.filter((i => !inp.ing.includes(i)));

		inp.limit.forEach((l) => {

			safeIng.forEach(safe => {
				const set = allOpts.get(safe);

				set.delete(l);
				allOpts.set(safe, set);
			})

		});
	});

	console.log(allOpts);

	const safe = Array.from(allOpts.entries()).filter(([k, v]) => v.size === 0).map(([k]) => k);

	// return input.reduce((acc, {ing}) => {
	// 	return acc + ing.filter(i => safe.includes(i)).length 
	// }, 0);

	safe.forEach((k) => {
		allOpts.delete(k);
	});

	console.log(allOpts);

	const list = [];

	while (allOpts.size) {

		const entries = Array.from(allOpts.entries());
		const next = entries.filter(([k, v]) => v.size === 1)[0];
		console.log(next);

		list.push({ing: next[0], limit: Array.from(next[1])[0]});
		const toDelete = Array.from(next[1])[0];

		entries.forEach(([k, s]) => {
			s.delete(toDelete);
		});

		allOpts.delete(next[0]);
		
		// return;
	}

	return list.sort((a, b) => {
		return a.limit > b.limit ? 1 : -1;
	})
	// .map(a => a.ing).join(',');
	.map(a => `${a.ing}-${a.limit}`).join(',');

};

describe('bob', () => {	
	it('works for test case 1', () => {
		const input = `mxmxvkd kfcds sqjhc nhms (contains dairy, fish)
trh fvjkl sbzzf mxmxvkd (contains dairy)
sqjhc fvjkl (contains soy)
sqjhc mxmxvkd sbzzf (contains fish)`;

		assert.equal(solve(input), `mxmxvkd,sqjhc,fvjkl`);
	});

	// it('works for test case 2', () => {
	// 	const input = `HERE`;

	// 	assert.equal(solve(input), 424242);

	// kbmlt,mrccxm,lpzgzmk,ppj,stj,jvgnc,gxnr,plrlg
	// });

	it('show the answer when ready!', () => {

		// const expected = 42;

		assert.equal(solve(puzzleInput), 'bob');
	});
});

