import assert from "assert";

export type PuzzleConfig = {
    year: number;
    day: number;
    token: string;
}

export const getPuzzleConfig = (): PuzzleConfig => {
    const session = process.env.AOC_SESSION;
    assert(!!session, `AOC_SESSION env variable missing`);
    const { aoc } = require('../../package.json');
    assert(aoc, `"aoc" missing in package.json`);

    const {year, day} = aoc;

    assert(year, `year missing in aoc package.json`);
    assert(day, `day missing in aoc package.json`);

    return {year, day, token: session};
}
