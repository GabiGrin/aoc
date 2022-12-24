import { State } from "./lib";


export type BP = Record<keyof State, State>
export const parseInput = (raw: string) => {
	return raw
    .split('\n')
		.map(r => {
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
        return {
          ore: {
            ore: Number(oreOre),
            clay: 0,
            obsidian: 0,
            geode: 0
          },
          clay: {
            ore: Number(clayOre),
            clay: 0,
            obsidian: 0,
            geode: 0
          },
          obsidian: {
            ore: Number(obsidianOre),
            clay: Number(obsidianClay),
            obsidian: 0,
            geode: 0
          },
          geode: {
            ore: Number(geodeOre),
            obsidian: Number(geodeObsidian),
            clay: 0,
            geode: 0
          }
          
        } as BP;
    });
		// .map(Number);
		// .map(v => v.split('').map(Number));

	// return gridFromMatix(rows);

}