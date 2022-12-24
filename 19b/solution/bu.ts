
// const calcQuality = (bp: ReturnType<typeof parseInput>[0]) => {
// 	let ore = 0;
// 	let clay = 0;
// 	let geode = 0;
// 	let obsidian = 0;
// 	let oreRobots = 1;
// 	let clayRobots = 0;
// 	let obsidianRobots = 0;
// 	let geodeRobots = 0;

// 	const buy = () => {
// 		let boughtOre = 0;
// 		let boughtClay = 0;
// 		let boughtObsidian = 0;
// 		let boughtGeode = 0;

// 		let bought = true;
// 		while (bought) {
// 			bought = false;
// 			if (bp.geodeObsidian <= obsidian && bp.geodeOre <= ore) {
// 				bought = true;
// 				boughtGeode++;
// 				obsidian-=bp.geodeObsidian;
// 				ore-=bp.geodeOre;
// 				continue;
// 			}

// 			if (bp.obsidianClay <= clay && bp.obsidianOre <= ore) {
// 				bought = true;
// 				boughtObsidian++;
// 				clay-=bp.obsidianClay;
// 				ore-=bp.obsidianOre;
// 				continue;
// 			}

// 			if (bp.clayOre <= ore) {
// 				bought = true;
// 				boughtClay++;
// 				ore-=bp.clayOre;
// 			}

// 			if (bp.oreOre <= ore) {
// 				bought = true;
// 				boughtOre++;
// 				ore-=bp.oreOre;
// 			}
// 		}

// 		return {boughtOre, boughtClay, boughtObsidian, boughtGeode};
// 	}

// 	const collect = () => {
// 		ore+= oreRobots;
// 		clay+=clayRobots;
// 		obsidian+=obsidianRobots;
// 		geode+=geodeRobots
// 	}

// 	for (let r = 0; r < 24; r++) {
// 		const bought = buy();
// 		collect();
// 		oreRobots+= bought.boughtOre
// 		clayRobots+= bought.boughtClay
// 		obsidianRobots+= bought.boughtObsidian
// 		geodeRobots+=bought.boughtGeode
// 	}


// 	return geode;
// }
