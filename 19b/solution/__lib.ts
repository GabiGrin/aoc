// // import { writeFileSync } from "fs";
// import { parseInput } from "./solve";

// export type BP = ReturnType<typeof parseInput>[0];

// export const empty = {
//   ore: 0,
//   clay: 0,
//   obsidian: 0,
//   geode: 0,
// };

// export type State = typeof empty;
// export type Type = keyof State;

// export const bottleNeck = (bp: BP, robots: State, type: Type) => {
//   switch (type) {
// 	case "ore": {
// 		return {ore: robots.ore / bp.oreOre}
// 	}
// 	case "clay": {
// 		return {ore: robots.ore / bp.clayOre}
// 	}
//     case "obsidian": {
//       const ore = robots.ore / bp.obsidianOre;
//       const clay = robots.clay / bp.obsidianClay;
//       return { ore, clay };
//     }
//     case "geode": {
//       const ore = robots.ore / bp.geodeOre;
//       const obs = robots.obsidian / bp.geodeObsidian;
//       return { ore, obsidian: obs };
//     }
//   }
// };



// export type Nope = {nope: string};

// export const isNope = (t: any): t is Nope => {
// 	return typeof (t as any).nope === 'string';
// }

// export const timeTo = (bp: BP, bob: State, robots: State, type: Type) => {

// 	const rs = {...empty};
// 	const inner = () => {
// 		switch (type) {
// 			case 'ore': {
// 				return (bp.oreOre - rs.ore) / robots.ore;
// 			} 
// 			case 'clay': {
// 				return (bp.clayOre - rs.ore) / robots.ore;
// 			}
// 			case 'obsidian': {
// 				const timeToClay = (bp.obsidianClay - rs.clay) / robots.clay;
// 				const timeToOre = (bp.obsidianOre - rs.ore) / robots.ore;				
				
// 				return Math.max(timeToClay, timeToOre);
// 			}
// 			case 'geode': {
// 				const timeToObsidian = (bp.geodeObsidian - rs.obsidian) / robots.obsidian;
// 				const timeToOre = (bp.geodeOre - rs.ore) / robots.ore;
	
// 				return Math.max(timeToObsidian, timeToOre);
// 			}
// 		}
// 	}

// 	const val = inner();
	
// 	if (Number.isFinite(val)) {
// 		return val;
// 	}
// 	return 9999999999999;
// }

// export const canBuy = (bp: BP, rs: State, type: Type) => {
// 	const canBuyOre = (state: State) => state.ore >= bp.oreOre;
// 	const canBuyClay = (state: State) => state.ore >= bp.clayOre;
// 	const canBuyObsidian = (state: State) => state.clay >= bp.obsidianClay && state.ore >= bp.obsidianOre;
// 	const canBuyGeode = (state: State) => state.ore >= bp.geodeOre && state.obsidian >= bp.geodeObsidian;
// 	return {
// 		ore: canBuyOre,
// 		clay: canBuyClay,
// 		obsidian: canBuyObsidian,
// 		geode: canBuyGeode
// 	}[type](rs)
// }

// export const payForRobot = (bp: BP, rs: State, type: Type) => {
// 	const buyOre = (state: State) => ({...state, ore: state.ore - bp.oreOre});
// 	const buyClay = (state: State) => ({...state, ore: state.ore - bp.clayOre});
// 	const buyObsidian = (state: State) => ({...state, ore: state.ore - bp.obsidianOre, clay: state.clay - bp.obsidianClay});
// 	const buyGeode = (state: State) => ({...state, ore: state.ore - bp.geodeOre, obsidian: state.obsidian - bp.geodeObsidian});

// 	return {
// 		ore: buyOre,
// 		clay: buyClay,
// 		obsidian: buyObsidian,
// 		geode: buyGeode
// 	}[type](rs)
// }

// export const addRobot = (robots: State, type: Type) => {
// 	const nr = {...robots}
// 	nr[type]++;	
// 	return nr;
// }


// export const collect = (rs: State, robots: State) => {
// 	const nrs = {...rs};
// 	for (const k in rs) {
// 	  nrs[k]+=robots[k]
// 	}
// 	return nrs
//   }

// export const nextBuy = (bp: BP, rs: State, robots: State, r: number): Array<Type | Nope> => {

// 	if (canBuy(bp, rs, 'geode')) {
// 		return ['geode'];
// 	} else {
// 		const timeNow = timeTo(bp, rs, robots, 'geode');
// 		const timeOre = timeTo(bp, payForRobot(bp, rs, 'ore'), addRobot(robots, 'ore'),  'geode')
// 		const timeObsidian = timeTo(bp, payForRobot(bp, rs, 'obsidian'), addRobot(robots, 'obsidian'),  'geode');

// 		const shouldWaitGeode = timeNow < timeOre && timeNow < timeObsidian;		

// 		if (shouldWaitGeode) {
// 			return [{nope: 'wait for geod'}];
// 		} else {
// 			if (timeObsidian < timeOre) {
// 				if (canBuy(bp, rs, 'obsidian')) {
// 					return ['obsidian']
// 				} else {
// 					const timeNow = timeTo(bp, rs, robots, 'obsidian');
// 					const timeOre = timeTo(bp, payForRobot(bp, rs, 'ore'), addRobot(robots, 'ore'),  'obsidian')
// 					const timeClay = timeTo(bp, payForRobot(bp, rs, 'clay'), addRobot(robots, 'clay'),  'obsidian')

					
// 					const shouldWaitObs = timeNow < timeOre && timeNow < timeClay;
					
// 					if (shouldWaitObs) {
// 						return [{nope: 'wait for obs'}]
// 					} else {
// 						if (timeClay < timeOre) {
// 							// buy clay														

// 							const waitTime = timeTo(bp, rs, robots, 'clay');
// 							const buyOreTime = timeTo(bp, payForRobot(bp, rs, 'ore'), addRobot(robots, 'ore'), 'clay');


//                             const opts = []
//                             if (canBuy(bp, rs, 'clay')) {
//                                 opts.push('clay' as Type)
//                             } else {
// 								opts.push({nope: 'wait and seee'})
// 							}
							
//                             return opts;
// 						} else {
// 							const opts = []
// 							if (canBuy(bp, rs, 'ore')) {
// 								return ['ore' as Type];
//                             } else {
// 								return[{nope: 'wait for ore'}]
// 							}
// 						}
// 					}
// 				}
// 			} else {
// 				if (canBuy(bp, rs, 'ore')) {
// 					return ['ore', {nope: 'try waiting'}];
// 				} else {
// 					return [{nope: 'cannot afford ore for geode'}]
// 				}
// 			}
// 		}
		
// 		return [{nope: 'wat?'}];
// 	}
// 	throw 'wat'
// }

