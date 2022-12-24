// import { puzzleInput } from "../lib/lib";
import { assert } from "chai";
import { ListFormat } from "typescript";
import { getTestCases } from "../runtime/lib/get-tests";
import { readInputFile } from "../runtime/lib/input-output-files";
import { calcBuyingOpts, calcQuality } from "./lib";

export const parseInput = (raw: string) => {
  const rows = raw
    .split("\n")
    .map((n) => n.trim())
    .filter((v) => !!v)
    .map((r) => {
      // Blueprint 8: Each ore robot costs 2 ore. Each clay robot costs 4 ore. Each obsidian robot costs 4 ore and 19 clay. Each geode robot costs 2 ore and 18 obsidian.

      const [
        _,
        num,
        oreOre,
        clayOre,
        obsidianOre,
        obsidianClay,
        geodeOre,
        geodeObsidian,
      ] = r
        .match(
          /Blueprint (\d+): Each ore robot costs (\d+) ore. Each clay robot costs (\d+) ore. Each obsidian robot costs (\d+) ore and (\d+) clay. Each geode robot costs (\d+) ore and (\d+) obsidian./
        )
        .map(Number);
      return {
        num,
        oreOre,
        clayOre,
        obsidianOre,
        obsidianClay,
        geodeOre,
        geodeObsidian,
      };
    });
  // .map(Number);
  // .map(v => v.split('').map(Number));

  // return gridFromMatix(rows);
  return rows;
};

export type BP = ReturnType<typeof parseInput>[0];

const empty = {
  ore: 0,
  clay: 0,
  obsidian: 0,
  geode: 0,
};

type State = typeof empty;
type Type = keyof State;

const bottleNeck = (bp: BP, robots: State, type: Type) => {
  switch (type) {
	case "ore": {
		return {ore: robots.ore / bp.oreOre}
	}
	case "clay": {
		return {ore: robots.ore / bp.clayOre}
	}
    case "obsidian": {
      const ore = robots.ore / bp.obsidianOre;
      const clay = robots.clay / bp.obsidianClay;
      return { ore, clay };
    }
    case "geode": {
      const ore = robots.ore / bp.geodeOre;
      const obs = robots.obsidian / bp.geodeObsidian;
      return { ore, obsidian: obs };
    }
  }
};


const canBuy = (bp: BP, rs: State, type: Type) => {
	const canBuyOre = (state: State) => state.ore >= bp.oreOre;
	const canBuyClay = (state: State) => state.ore >= bp.clayOre;
	const canBuyObsidian = (state: State) => state.clay >= bp.obsidianClay && state.ore >= bp.obsidianOre;
	const canBuyGeode = (state: State) => state.ore >= bp.geodeOre && state.obsidian >= bp.geodeObsidian;
	return {
		ore: canBuyOre,
		clay: canBuyClay,
		obsidian: canBuyObsidian,
		geode: canBuyGeode
	}[type](rs)
}

const payForRobot = (bp: BP, rs: State, type: Type) => {
	const buyOre = (state: State) => ({...state, ore: state.ore - bp.oreOre});
	const buyClay = (state: State) => ({...state, ore: state.ore - bp.clayOre});
	const buyObsidian = (state: State) => ({...state, ore: state.ore - bp.obsidianOre, clay: state.clay - bp.obsidianClay});
	const buyGeode = (state: State) => ({...state, ore: state.ore - bp.geodeOre, obsidian: state.obsidian - bp.geodeObsidian});

	return {
		ore: buyOre,
		clay: buyClay,
		obsidian: buyObsidian,
		geode: buyGeode
	}[type](rs)
}

type Nope = {nope: string};

const isNope = (t: any): t is Nope => {
	return typeof (t as any).nope === 'string';
}

const timeTo = (bp: BP, rs: State, robots: State, type: Type) => {

	const inner = () => {
		switch (type) {
			case 'ore': {
				return (bp.oreOre - rs.ore) / robots.ore;
			} 
			case 'clay': {
				return (bp.clayOre - rs.ore) / robots.ore;
			}
			case 'obsidian': {
				const timeToClay = (bp.obsidianClay - rs.clay) / robots.clay;
				const timeToOre = (bp.obsidianOre - rs.ore) / robots.ore;

				console.log(rs.ore, timeToOre);
				
				
				return Math.max(timeToClay, timeToOre);
			}
			case 'geode': {
				const timeToObsidian = (bp.geodeObsidian - rs.obsidian) / robots.obsidian;
				const timeToOre = (bp.geodeOre - rs.ore) / robots.ore;
	
				return Math.max(timeToObsidian, timeToOre);
			}
		}
	}

	const val = inner();
	
	if (Number.isFinite(val)) {
		return val;
	}
	return 9999999999999;
}


const nextBuy = (bp: BP, rs: State, robots: State, r: number): Type | Nope => {
	if (canBuy(bp, rs, 'geode')) {
		return 'geode'
	} else {
		const bn = bottleNeck(bp, robots, 'geode');
		if (bn.obsidian > bn.ore) {
			if (canBuy(bp, rs, 'ore')) {
				return 'ore';
			} else {
				return {nope: 'next is ore for geode, but not enough'};
			}
		} else {
			if (canBuy(bp, rs, 'obsidian')) {
				return 'obsidian'
			} else {
				const bn = bottleNeck(bp, robots, 'obsidian');
				console.log(r, bn);
				
				if (bn.clay > bn.ore) {
					if (rs.ore + robots.ore < bp.obsidianOre) {
						if (canBuy(bp, rs, 'ore')) {
							return 'ore'
						} else {
							return {nope: 'next is ore for obsidian, but not enough'};
						}
					} else {
						return {nope: 'next is obsidian, just need to wait'};
					}
				} else {
					if ((rs.clay + robots.clay) < bp.obsidianClay) {
						if (canBuy(bp, rs, 'clay')) {
							return 'clay';
						} else {
							return {nope: 'next is clay, but cannot afford'};
						}
					} else {
						return {nope: 'next is justwait?!'};
					}
				}
			}
		}
		throw 'wat?';
	}
}

const addRobot = (robots: State, type: Type) => {
	const nr = {...robots}
	nr[type]++;	
	return nr;
}

const nextBuy2 = (bp: BP, rs: State, robots: State, r: number) => {

	if (canBuy(bp, rs, 'geode')) {
		return 'geode';
	} else {
		const timeNow = timeTo(bp, rs, robots, 'geode');
		const timeOre = timeTo(bp, payForRobot(bp, rs, 'ore'), addRobot(robots, 'ore'),  'geode')
		const timeObsidian = timeTo(bp, payForRobot(bp, rs, 'obsidian'), addRobot(robots, 'obsidian'),  'geode');

		const shouldWaitGeode = timeNow < timeOre && timeNow < timeObsidian;		

		if (shouldWaitGeode) {
			return {nope: 'wait for geod'};
		} else {
			if (timeObsidian < timeOre) {
				if (canBuy(bp, rs, 'obsidian')) {
					return 'obsidian'
				} else {
					const timeNow = timeTo(bp, rs, robots, 'obsidian');
					const timeOre = timeTo(bp, payForRobot(bp, rs, 'ore'), addRobot(robots, 'ore'),  'obsidian')
					const timeClay = timeTo(bp, payForRobot(bp, rs, 'clay'), addRobot(robots, 'clay'),  'obsidian')

					const shouldWaitObs = timeNow < timeOre && timeNow < timeClay;

					if (shouldWaitObs) {
						return {nope: 'wait for obs'};
					} else {
						if (timeClay < timeOre) {
							// buy clay														

							const waitTime = timeTo(bp, rs, robots, 'clay');
							const buyOreTime = timeTo(bp, payForRobot(bp, rs, 'ore'), addRobot(robots, 'ore'), 'clay');


							console.log(waitTime, buyOreTime);
							
							if (buyOreTime <= waitTime ) {
								if (canBuy(bp, rs, 'ore')) {
									return 'ore'
								} else {
									return {nope: 'cannot afford ore (for clay)'}
								}
							} else {
								if (canBuy(bp, rs, 'clay')) {
									return 'clay';
								} else {
									return {nope: 'cannot afford clay'}
								}
							}

						} else {
							if (canBuy(bp, rs, 'ore')) {
								return 'ore';
							} else {
								return {nope: 'cannot afford ore for obs'}
							}
						}
					}
				}
			} else {
				if (canBuy(bp, rs, 'ore')) {
					return 'ore';
				} else {
					return {nope: 'cannot afford ore for geode'}
				}
			}
		}
		
		return {nope: 'wat?'};
	}
	throw 'wat'
}

const calcQuality = (bp: BP) => {

	let rs: State = {...empty};
	let robots: State = {...empty, ore: 1};

    const purchasesRound = (r: number) => {
      let newRobots = {...robots};

      let bought = true;
      while (bought) {
        bought = false;

		const next = nextBuy2(bp, rs, newRobots, r);
		// console.log(r, next, rs);
		
		// console.log(r, next, rs);

		if (!isNope(next)) {
			// console.log('buying', next);
			rs = payForRobot(bp, rs, next);
			newRobots[next]++;
			bought=true;
		}
      }	  

      return newRobots;
    };

    const collect = () => {
      rs.ore += robots.ore;
      rs.clay += robots.clay;
      rs.obsidian += robots.obsidian;
      rs.geode += robots.geode;
    };

    for (let r = 1; r <= 24; r++) {
	  const bought = purchasesRound(r);
	  collect();
	  robots = bought;
    }

    return rs.geode;
  };

export const solve = (raw: string): any => {
  const input = parseInput(raw);

  return input.map(bp => ({q: calcQuality(bp), n: bp.num})).reduce((a, b) => {
    return a + b.q * b.n;
  }, 0);
};

// for wallaby
describe("part 1 tests", () => {
//   it("buying opt", () => {
//     const case1 = getTestCases()[0];
//     const bp = parseInput(case1.input)[0];
//     const curr = { ore: 40, clay: 14, geode: 0, obsidian: 14 };
//     const opt = { ore: 0, clay: 0, geode: 0, obsidian: 0 };
//     const op1 = calcBuyingOpts(curr, opt, bp);
//     // console.log(op1.length);
//     // console.log(op1);
//   });
  it("calculates quality level", () => {
    const case1 = getTestCases()[0];
    // const q1 = calcQuality(parseInput(case1.input)[0]);
    // assert.equal(q1, 9);
  });

  it.only("calculates quality level", () => {
    const case1 = getTestCases()[0];
    const q2 = calcQuality(parseInput(case1.input)[1]);
    assert.equal(q2, 12);
  });

  it("passes for case 1 if exists", () => {
    const case1 = getTestCases()[0];
    if (case1) {
      const actual = solve(case1.input);
      assert.equal(actual, case1.expected);
    } else {
      // no test case
    }
  });

  it("passes for case 2 if exists", () => {
    const case2 = getTestCases()[1];
    if (case2) {
      const actual = solve(case2.input);
      assert.equal(actual, case2.expected);
    } else {
      // no test case
    }
  });

  it("passes for case 3 if exists", () => {
    const case3 = getTestCases()[2];
    if (case3) {
      const actual = solve(case3.input);
      assert.equal(actual, case3.expected);
    } else {
      // no test case
    }
  });

  it("passes for case 4 if exists", () => {
    const case4 = getTestCases()[3];
    if (case4) {
      const actual = solve(case4.input);
      assert.equal(actual, case4.expected);
    } else {
      // no test case
    }
  });

  it("passes for case 5 if exists", () => {
    const case5 = getTestCases()[4];
    if (case5) {
      const actual = solve(case5.input);
      assert.equal(actual, case5.expected);
    } else {
      // no test case
    }
  });

  it("passes input if exists", () => {
    // const input = readInputFile();
    // const actual = solve(input);
    // console.log({actual});
  });
});
