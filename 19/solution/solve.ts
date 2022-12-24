import {assert} from 'chai';
import { getTestCases } from '../runtime/lib/get-tests';
import { addItems, calcOpts, canAfford, empty, itemKey, robotsPrice, State, subtractItems } from './lib';
import { BP, parseInput } from './parse';
import { range } from './utils';


export const calc = (bp: BP, minutes: number): number => {


  let rounds = 0;
  let skipped = 0;

  const maxOre = Math.max(...Object.values(bp).map(o => o.ore)) * 10;
  const maxClay = Math.max(...Object.values(bp).map(o => o.clay)) * 10;

  const maxGeodesPerMin = new Map(range(minutes).map((_, i) => ([i, -Infinity])));
  const maxObsidiansPerMin = new Map(range(minutes).map((_, i) => ([i, -Infinity])));

  const vis = new Set();
  const roundKey = (rs: State, rb: State, mins: number) => {
    return itemKey(rs)+','+itemKey(rb)+','+mins;
  }

  const maxClayRobots = bp.obsidian.clay;
  const maxOreRobots = Math.max(bp.ore.ore, bp.clay.ore, bp.obsidian.ore, bp.geode.ore);
  const maxObsRobots = bp.geode.obsidian;


  const validateRound = (minutes: number, robots: State, rs: State) => {
    const k = roundKey(rs, robots, minutes);
    if (vis.has(k)) {
      return false;
    }
    if (maxGeodesPerMin.get(minutes) > rs.geode) {
      return false;
    }

    if (robots.clay > maxClayRobots) {
      return false;
    }
    if (robots.ore > maxOreRobots) {
      return false;
    }
    if (robots.obsidian > maxObsRobots) {
      return false;
    }

    return true;
  }

  const round = (rs: State, robots: State, minutes: number) => {
    rounds++;

    if (minutes === 0) {
      return rs.geode;
    }

    if (maxGeodesPerMin.get(minutes) < rs.geode) {
      maxGeodesPerMin.set(minutes, rs.geode)
    }

    const k = roundKey(rs, robots, minutes);
    vis.add(k);

    if (rounds % 1000000 === 0) {
      console.log('rounds',rounds, skipped, minutes); 
    }

    const toBuy = calcOpts(bp, rs);
    const postCollect = addItems(rs, robots);

    const nextOpts = toBuy.map((newRobots) => { 
      const price = robotsPrice(bp, newRobots);
      const afterBuy = subtractItems(postCollect, price);
      const totalRobots = addItems(robots, newRobots);

      const newMinutes = minutes - 1;

      if (validateRound(newMinutes, totalRobots, afterBuy)) {
        const val = round(afterBuy, totalRobots, newMinutes);
        return val;
      } else {
        skipped++;
        return 0;
      }
    });

    return Math.max(...nextOpts);
  }

  const val = round(empty, {...empty, ore: 1}, minutes);
  // console.log({rounds, skipped});

  return val;
}

export const solve = (raw: string, minutes: number): any => {
	const input = parseInput(raw);
	return input.reduce((acc, curr, i) => {
    const q = calc(curr, minutes);

    console.log({q, i: i +1});
    return acc * (q);
  }, 1)
};


describe('quality', () => {
  const t = parseInput(getTestCases()[0].input);
  it.only('works for first', () => {
    const q = calc(t[0], 24);
    assert.equal(q, 9)
  })

  it('works for second', () => {
    const q = calc(t[1], 24);
    assert.equal(q, 12)
  })

  it('works for that example from input', () => {
    
  })
})


