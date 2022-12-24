// // import { writeFileSync } from "fs";
// // import { parseInput } from "./solve";

// import { parseInput } from "./solve";

// // export const _calcQuality = (bp: ReturnType<typeof parseInput>[0]) => {
// // 	let ore = 0;
// // 	let clay = 0;
// // 	let geode = 0;
// // 	let obsidian = 0;
// // 	let oreRobots = 1;
// // 	let clayRobots = 0;
// // 	let obsidianRobots = 0;
// // 	let geodeRobots = 0;

// // 	const buy = () => {
// // 		let boughtOre = 0;
// // 		let boughtClay = 0;
// // 		let boughtObsidian = 0;
// // 		let boughtGeode = 0;

// // 		let bought = true;
// // 		while (bought) {
// // 			bought = false;
// // 			if (bp.geodeObsidian <= obsidian && bp.geodeOre <= ore) {
// // 				bought = true;
// // 				boughtGeode++;
// // 				obsidian-=bp.geodeObsidian;
// // 				ore-=bp.geodeOre;
// // 				continue;
// // 			}

// // 			if (bp.obsidianClay <= clay && bp.obsidianOre <= ore) {
// // 				bought = true;
// // 				boughtObsidian++;
// // 				clay-=bp.obsidianClay;
// // 				ore-=bp.obsidianOre;
// // 				continue;
// // 			}

// // 			if (bp.clayOre <= ore) {
// // 				bought = true;
// // 				boughtClay++;
// // 				ore-=bp.clayOre;
// // 			}

// // 			if (bp.oreOre <= ore) {
// // 				bought = true;
// // 				boughtOre++;
// // 				ore-=bp.oreOre;
// // 			}
// // 		}

// // 		return {boughtOre, boughtClay, boughtObsidian, boughtGeode};
// // 	}

// // 	const collect = () => {
// // 		ore+= oreRobots;
// // 		clay+=clayRobots;
// // 		obsidian+=obsidianRobots;
// // 		geode+=geodeRobots
// // 	}

// // 	for (let r = 0; r < 24; r++) {
// // 		const bought = buy();
// // 		collect();
// // 		oreRobots+= bought.boughtOre
// // 		clayRobots+= bought.boughtClay
// // 		obsidianRobots+= bought.boughtObsidian
// // 		geodeRobots+=bought.boughtGeode
// // 	}

	



// // 	return geode;
// // }

// export type BP = ReturnType<typeof parseInput>[0];
// const empty = {
//     ore: 0,
//     clay: 0,
//     geode: 0,
//     obsidian: 0
//  }
// export type State = typeof empty;


// // export const cacheKey = (opt: BuyingOption) => Object.entries(opt).sort((a, b) => a[0].localeCompare(b[0])).map(p => p[1]).join(',');

// // export const calcBuyingOpts = (state: State, opt: BuyingOption, bp: BP, viz = new Set()): BuyingOption[] => {

// //         let opts = [];

// //         const canBuyOre = (state: State) => state.ore >= bp.oreOre;
// //         const canBuyClay = (state: State) => state.ore >= bp.clayOre;
// //         const canBuyObsidian = (state: State) => state.clay >= bp.obsidianClay && state.ore >= bp.obsidianOre;
// //         const canBuyGeode = (state: State) => state.ore >= bp.geodeOre && state.obsidian >= bp.geodeObsidian;

// //         const buyOre = (state: State) => ({...state, ore: state.ore - bp.oreOre});
// //         const buyClay = (state: State) => ({...state, ore: state.ore - bp.clayOre});
// //         const buyObsidian = (state: State) => ({...state, ore: state.ore - bp.obsidianOre, clay: state.clay - bp.obsidianClay});
// //         const buyGeode = (state: State) => ({...state, ore: state.ore - bp.geodeOre, obsidian: state.obsidian - bp.geodeObsidian});
        

// //         let canBuy = false;
// //         if (canBuyOre(state)) {
// //             const newState = buyOre(state)
// //             const newOpt = {...opt, ore: opt.ore + 1};

// //             canBuy=true;

// //             if (!viz.has(cacheKey(newOpt))) {
// //                 const afterOre = calcBuyingOpts(newState, newOpt, bp, viz);
// //                 opts.push(...afterOre)
// //             }
// //         }

// //         if (canBuyClay(state)) {
// //             const newState = buyClay(state)
// //             const newOpt = {...opt, clay: opt.clay + 1};
// //             canBuy=true;
// //             // viz.add(cacheKey(newOpt));
// //             if (!viz.has(cacheKey(newOpt))) {
// //             const afterClay = calcBuyingOpts(newState, newOpt, bp, viz);
// //             opts.push(...afterClay)
// //             }
// //         } 
// //         if (canBuyObsidian(state)) {
// //             const newState = buyObsidian(state)
// //             const newOpt = {...opt, obsidian: opt.obsidian + 1};
// //             canBuy=true;
// //             // viz.add(cacheKey(newOpt));
// //             if (!viz.has(cacheKey(newOpt))) {
// //             const afterObsidian = calcBuyingOpts(newState, newOpt, bp, viz);
// //             opts.push(...afterObsidian)
// //             }
// //         }

// //         if (canBuyGeode(state)) {
// //             const newState = buyGeode(state)
// //             const newOpt = {...opt, geode: opt.geode + 1};
// //             canBuy=true;
// //             if (!viz.has(cacheKey(newOpt))) {
// //             const afterGeode = calcBuyingOpts(newState, newOpt, bp, viz);
// //             // viz.add(cacheKey(newOpt));
// //             opts.push(...afterGeode)
// //             }
// //         }
        
// //         opts.push(opt)
// //         // if (!canBuy) {
// //         // }

// //         opts.forEach((opt) => {
// //             viz.add(cacheKey(opt));
// //         });
        
        
        
// //         return opts
// //     }


// // export const calcQuality = (bp: BP) => {


// //     const curr = {
// //         state: {...empty},
// //         robots: {...empty, ore: 1},
// //         minutes: 23
// //     }

// //     const queue = [curr];

// //     const finished = [];

// //     let most = 0;

// //     const itemKey = (item: typeof curr) => {
// //         return `s:${cacheKey(item.state)},r:${cacheKey(item.robots)}|${item.minutes}`;
// //     }
    
// //     const viz = new Set();

// //     let i = 0;
    
// //     while (queue.length) {
// //         const curr = queue.shift();

// //         const {state, robots} = curr;

// //         if (state.geode > 9) {
// //             console.log(state);
            
// //             throw 'b'
// //         }

// //         if (curr.minutes < 0) {
// //             if (most < curr.state.geode) {
// //                 finished.push(curr);
// //                 most = curr.state.geode;
// //             }
// //             continue;
// //         }


    
// //         const opts = calcBuyingOpts(state, empty, bp)
// //         .filter((opt) => {
// //             // if (opt.ore + robots.ore > ((robots.clay + opt.clay) + 5)) {
// //             //     return false;
// //             // }

// //             // if (opt.clay + robots.clay > ((robots.obsidian + opt.obsidian) + 5)) {
// //             //     return false;
// //             // }

// //             // if (opt.obsidian + robots.obsidian > ((robots.geode + opt.geode) + 5)) {
// //             //     return false;
// //             // }
// //             return true;
// //         })

// //         // console.log(opts, state);
        
        

// //         // console.log(opts.length);
// //         if (i++ % 1000 === 0) {
// //             // console.log(opts);

// //             // if (state.geode > 9) {
// //             //     console.log(curr);
// //             //     throw 'bob'
                
// //             // }
            
// //             console.log('I', i,'Q', queue.length, 'Opts', opts.length, 'min', curr.minutes, 'O', curr.state.obsidian, 'G', curr.state.geode);
// //             console.log('FL', finished.length, most);
            
// //         }
        

// //         const buy = (opt: BuyingOption, state: State, robots: State): State => {
// //             return {
// //                 geode: state.geode + robots.geode,
// //                 obsidian: state.obsidian - (opt.geode * bp.geodeObsidian) + robots.obsidian,
// //                 clay: state.clay - (opt.obsidian  * bp.obsidianClay) + robots.clay,
// //                 ore: state.ore - (opt.ore * bp.oreOre) - (opt.clay * bp.clayOre) - (opt.obsidian * bp.obsidianOre) - (opt.geode * bp.geodeOre) + robots.ore
// //             }
// //         }


// //         const next = opts.map(opt => {

// //             const newState = buy(opt, state, robots);
// //             if (newState.geode > 9) {
// //                 console.log(newState, opt, curr);
                
// //                 throw 'bob'
// //             }

// //             return {
// //                 state: buy(opt, state, robots),
// //                 robots: {
// //                     ore: robots.ore + opt.ore,
// //                     clay: robots.clay + opt.clay,
// //                     obsidian: robots.obsidian + opt.obsidian,
// //                     geode: robots.geode + opt.geode,
// //                 },
// //                 minutes: curr.minutes - 1
// //             }
// //         }).filter(item => {
// //             if (viz.has(itemKey(item))) {
// //                 return false;
// //             }
// //             return true;
// //         })
// //         .filter(item => !(!item.robots.clay && item.minutes < 20))
// //         .filter(item => !(!item.robots.obsidian && item.minutes < 10))
// //         .sort((b, a) => a.state.geode - b.state.geode || a.state.obsidian - b.state.obsidian)


// //         next.forEach((item) => {
// //             viz.add(itemKey(item))
// //             queue.push(item);
// //         })
        
// //     }


// //     return finished.reduce((a, b) => Math.max(a, b.state.geode), -Infinity);
    

	



// // 	return finished[0].state.geode;
// // }


// export type BP = ReturnType<typeof parseInput>[0];

// const empty = {
//   ore: 0,
//   clay: 0,
//   obsidian: 0,
//   geode: 0,
// };

// type State = typeof empty;
// type Type = keyof State;

// const bottleNeck = (bp: BP, robots: State, type: Type) => {
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


// export const nextBuy2 = (bp: BP, rs: State, robots: State, r: number) => {

// 	if (canBuy(bp, rs, 'geode')) {
// 		return 'geode';
// 	} else {
// 		const timeNow = timeTo(bp, rs, robots, 'geode');
// 		const timeOre = timeTo(bp, payForRobot(bp, rs, 'ore'), addRobot(robots, 'ore'),  'geode')
// 		const timeObsidian = timeTo(bp, payForRobot(bp, rs, 'obsidian'), addRobot(robots, 'obsidian'),  'geode');

// 		const shouldWaitGeode = timeNow < timeOre && timeNow < timeObsidian;		

// 		if (shouldWaitGeode) {
// 			return {nope: 'wait for geod'};
// 		} else {
// 			if (timeObsidian < timeOre) {
// 				if (canBuy(bp, rs, 'obsidian')) {
// 					return 'obsidian'
// 				} else {
// 					const timeNow = timeTo(bp, rs, robots, 'obsidian');
// 					const timeOre = timeTo(bp, payForRobot(bp, rs, 'ore'), addRobot(robots, 'ore'),  'obsidian')
// 					const timeClay = timeTo(bp, payForRobot(bp, rs, 'clay'), addRobot(robots, 'clay'),  'obsidian')

// 					const shouldWaitObs = timeNow < timeOre && timeNow < timeClay;

// 					if (shouldWaitObs) {
// 						return {nope: 'wait for obs'};
// 					} else {
// 						if (timeClay < timeOre) {
// 							// buy clay														

// 							const waitTime = timeTo(bp, rs, robots, 'clay');
// 							const buyOreTime = timeTo(bp, payForRobot(bp, rs, 'ore'), addRobot(robots, 'ore'), 'clay');

							

							
// 							if (buyOreTime < waitTime ) {
// 								if (canBuy(bp, rs, 'ore')) {
// 									return 'ore'
// 								} else {
// 									return {nope: 'cannot afford ore (for clay)'}
// 								}
// 							} else {
// 								if (canBuy(bp, rs, 'clay')) {
// 									return 'clay';
// 								} else {
// 									return {nope: 'cannot afford clay'}
// 								}
// 							}

// 						} else {
// 							if (canBuy(bp, rs, 'ore')) {
// 								return 'ore';
// 							} else {
// 								return {nope: 'cannot afford ore for obs'}
// 							}
// 						}
// 					}
// 				}
// 			} else {
// 				if (canBuy(bp, rs, 'ore')) {
// 					return 'ore';
// 				} else {
// 					return {nope: 'cannot afford ore for geode'}
// 				}
// 			}
// 		}
		
// 		return {nope: 'wat?'};
// 	}
// 	throw 'wat'
// }