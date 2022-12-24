// import { puzzleInput } from "../lib/lib";
import {assert} from 'chai';
import { getTestCases } from '../runtime/lib/get-tests';
import { readInputFile } from '../runtime/lib/input-output-files';
import { createGraph } from './utils/graphs';

const parseInput = (raw: string) => {
	const rows = raw
		.split('\n')
		.map(n => n.trim())
		.filter((v) => !!v)
		.map(r => {
			//Valve DD has flow rate=20; tunnels lead to valves CC, AA, EE
			
			// console.log(r);
			const matches = r.match(/^Valve (..) has flow rate=(-?\d+); tunnels? leads? to valves? (.*)/)
			if (!matches) {
				console.log(r);
				throw 'bbo'
			}
			const [, id, rate, leads] = matches;

			return {id, rate: Number(rate), leads: leads.split(', ')}

			// return r;
		})
		// .map(Number);
		// .map(v => v.split('').map(Number));

	// return gridFromMatix(rows);
	return rows;
}

export const solve = (raw: string): any => {
	const input = parseInput(raw);

	const open = new Set();
	let mins = 30;
	let p = 0;
	let total = 0;



	const map = new Map(input.map(item => ([item.id, item])));

	const graph = createGraph();
	input.forEach(item => {
		graph.addNode(item.id, item.rate);
	})

	input.forEach(item => {
		item.leads.forEach(target => {
			graph.addConnection(item.id, target, true);
		});
	});


	const step = (item) => {
		if (item.mins > 0) {
			item.mins--;
			item.total+= item.p;
		}
	}


	const calcPotential = (to, mins) => {
	
		const queue = [to];
		const vis = new Set();
		let total = 0;

		while (queue.length) {
			const {id, tot} = queue.shift();
			const item = map.get(id);
			total+= item.rate;
			vis.add(id);

			const items = item.leads.map(lead => {

			})

			queue.push(...item.leads.filter(id => !vis.has(id)));
		}

		// console.log(vis, total);
		

		return total;

	}

	let queue = [{id: input[0].id, mins: 30, total: 0, p: 0, open: new Set()}];


	const totals = [];
	while (queue.length) {


		const curr = queue.shift();

		if (curr.mins <=0 ) {
			totals.push(curr)
		}

		const currItem = map.get(curr.id)

		const opts = currItem.leads.map(id => map.get(id))
			.map(item => {
				return {id: item.id, total: curr.total + curr.p, open: curr.open, mins: curr.mins - 1, p: curr.p}
			})
			.filter(item => item.mins >= 0 )
			.sort((a, b) => {
				
				return map.get(b.id).rate - map.get(a.id).rate;
			})
		
		if (currItem.rate && !curr.open.has(currItem)) {
			const newSet = new Set(curr.open);
			newSet.add(curr.id);
			opts.unshift({
				id: curr.id,
				mins: curr.mins - 1,
				total: curr.total + curr.p,
				open: newSet,
				p: curr.p + currItem.rate
			})
		}

		if (queue.length > 1000) {
			return;
		}

		// console.log(queue.length);
		
		
		queue.push(...opts);


	}
	// console.log(input);
	
	console.log(totals);
	

	return totals.length;
	// return total;
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
