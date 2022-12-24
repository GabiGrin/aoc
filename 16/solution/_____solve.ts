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
			const matches = r.match(/^Valve (..) has flow rate=(-?\d+); tunnels? leads? to valves? (.*)/)
			if (!matches) {
				console.log(r);
				throw 'bbo'
			}
			const [, id, rate, leads] = matches;
			return {id, rate: Number(rate), leads: leads.split(', ')}
		})
	return rows;
}

export const solve = (raw: string): any => {
	const input = parseInput(raw);

	const map = new Map(input.map(item => ([item.id, item])));

  const graph = createGraph();
  input.forEach((item) => {
    graph.addNode(item.id, item.rate);
  });

  input.forEach((item) => {
    item.leads.forEach((target) => {
      graph.addConnection(item.id, target, true);
    });
  });

  const toVisit = new Set(input.filter(i => i.rate));


  const calcDis = (from, to) => {
    return graph.shortestPath(from, to).length;
  }

  // get all points of interest

  // create function that calculates distance between point a and b

  /*
  // start with AA
      for each point of interest not visited
        calculate distance
        sort by distance descending


  */



  const aggViz = new Set();

	let queue = [{id: 'AA', mins: 30, total: 0, p: 0, open: new Set<string>(), type: 'move', viz: new Set(),
   log: [], 
   prev: ''}];
	const totals = [];


  let highest = 0;

  // const viz = new Set();

  let totalViz = 0;
	while (queue.length) {
    totalViz++;

    if (totalViz % 100000 === 0) {
      console.log(totalViz, highest, queue.length);
    }
    
		const curr = queue.pop();

    aggViz.add(curr.log.join(''));

    if (curr.mins < 0) {
      continue;
      // throw new Error('bob')
    }

    
		if (curr.mins === 0 ) {
      // console.log('pushing total', curr);
      if (curr.total >= highest) {
        totals.push(curr)
        highest = curr.total
      }
			// totals.push(curr)
		}

    // console.log('visiting', curr.id, curr.type);
    
		const currItem = map.get(curr.id)

		const opts = currItem.leads.map(id => map.get(id))
			.map(item => {
        const viz = new Set(curr.viz);
        if (curr.prev) {
          viz.add(curr.id + item.id)
        }
				const newItem = {
          ...curr, id: item.id, total: curr.total + curr.p, mins: curr.mins - 1, type: 'move',
          prev: item.id,
          log: [...curr.log, item.id],
          viz
        };
        return newItem;
			})
			.filter(item => {
        if (curr.viz.has(curr.id + item.id)) {
        // if (aggViz.has(item.log.join(''))) {  
          // console.log('bad');
          
          return false;
        } else if (item.mins < 0) {
          return false;
        }
        return true;
      })
			.sort((a, b) => {
				return map.get(b.id).rate - map.get(a.id).rate;
			});
    
    // opts.forEach((opt) => {
    //   if (curr.prev) {
    //     aggViz.add(curr.id + opt.id);
    //   }
    // })
		
		if (currItem.rate && !curr.open.has(currItem.id)) {

			const newSet = new Set(curr.open);
			newSet.add(curr.id);
			opts.unshift({
        ...curr,
				mins: curr.mins - 1,
				total: curr.total + curr.p,
				open: newSet,
				p: curr.p + currItem.rate,
        log: [...curr.log, 'Open'],
        type: 'open'
			})
      // console.log(opts);
		}


    if (opts.length === 0) {
      
      const total = curr.total + (curr.mins * curr.p);
      if (curr.total >= highest) {
        totals.push(curr)
        highest = curr.total
      }
      // totals.push(curr);
    }
    queue.push(...opts);
    
	}

  // return

  // const fixedTotals = totals.map((item) => {

  //   return {...item, mins: 0, total: item.total + (item.mins * item.p)};
  // })

  // fixedTotals.sort((a,b) => b.total - a.total);

	// console.log(fixedTotals.map(t => t.total));

  // console.log(fixedTotals[0]);
  
    console.log(totals.map(t => t.log.join('->')));
    
  console.log({totalViz});
  console.log({highest});
  
  return highest;
  
	

	// return totals.length;
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

	it('passes input if exists', () => {
		// const input = readInputFile();
		
		
		// const actual = solve(input);
		// console.log({actual});
	});
})
