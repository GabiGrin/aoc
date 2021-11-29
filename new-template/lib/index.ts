import { fstatSync, readdirSync, readFileSync } from "fs";
import { seq } from "../solution/utils";

const notifier = require('node-notifier');

import { fork } from 'child_process';

import * as path from 'path';

export type PuzzleConfig = {
    year: number;
    day: number;
}

const readFixture = (fileName: string) => {
    return readFileSync(`./${fileName}`, 'utf-8');
}

const getFixture = (part: 1 | 2, n) => {
    const input = readFixture(`part${part}-tests/case${n}-input`);
    const expected = readFixture(`part${part}-tests/case${n}-output`);
    return {input, expected, n};
}

export const getFixtures = (part: 1 | 2) => {
    const max = readdirSync(`./part${part}-tests`).length / 2;
    return seq(max).map((i) => {
        try {
            return getFixture(part, i + 1);
        } catch (e) {
            console.error('Original error', e);
            throw new Error(`Unable to read fixture number ${i}. Make sure you have a pair number of input and outputs and they are properly named.`);
        }
    })
    .filter(({input, expected, n}) => {
        if (input === 'TBD' && expected) {
            throw new Error(`You haven't entered an input for case ${n} but enterred an expected value. This is probably a mistake. Fix this.`);
        }

        if (input !== 'TBD' && !expected) {
            throw new Error(`You haven't entered an expected value for case ${n} but enterred an input. This is probably a mistake. Fix this.`);
        }

        if (!input) {
            throw new Error(`You've erased input for case ${n}. This might be a mistake.. To skip it leave it "TBD" and leave the output empty`);
        }
        return input !== 'TBD';
    });
}

export const readInput = () => {
    const p = path.resolve(`${__dirname}/../input.txt`);
    return readFileSync(p, 'utf-8');
}

export const getAocConfig = () => {
    try {
        const { aoc } = require('../package.json');
        const {year, day} = aoc;
    
        if (!year || !day) {
            throw new Error(`Invalid aoc config in package.json (invalid year or day) - ${JSON.stringify(aoc)}`);
        }
        return {year, day};
    } catch (e) {
        throw new Error(`Invalid aoc config in package.json (no aoc) - ${e}`);
    }
}

export const notify = (msg) => {
    const now = new Date();
    console.log(`[${now.toLocaleTimeString()}] ${msg}`);
    notifier.notify(msg);
}
export const delay = (ms) => (new Promise(r => setTimeout(r, ms)));

export const solveForked = (input: string, part = 1 | 2) => {

    const FORK_TIMEOUT = 5000;

    const tsNodePath = require.resolve(`ts-node`);
    const forkPath = path.resolve(__dirname, './__forked__solver.ts');
    const child = fork(forkPath, [], {
        execArgv: [ tsNodePath.replace('index.js', 'bin.js')]
    });

    let timeoutTimer;
    const promise = new Promise<string>((res, rej) => {

        if (part === 1) {
            child.on('message', (message) => {
                if (typeof message.solution1 !== 'undefined') {
                     res(message.solution1);
                     child.kill(0);
                 } else {
                     console.log(`unknown message`, message, 'received', {part});
                 }
            });
            child.send({solve1: input});
        } else if (part === 2) {
            child.on('message', (message) => {
                    if (typeof message.solution2 !== 'undefined') {
                        res(message.solution2);
                        child.kill(0);
                    } else {
                        console.log(`unknown message`, message, 'received', {part});
                    }
            });
            child.send({solve2: input});
        }

        timeoutTimer = setTimeout(() => {
            rej(`Timeout`);
        }, FORK_TIMEOUT);
    });

    return {promise, cancel: () => {
        console.log('killing process');
        clearTimeout(timeoutTimer);
        child.kill('SIGINT');
    }}
}

export const guessCurrentPart = () => {
    const p2 = getFixtures(2);
    if (p2.length) {
        return 2;
    } else {
        return 1;
    }
}

export const runFixtures = (part: 1 | 2) => {
    const fixtures = getFixtures(part);

    const results = fixtures.map(({input, expected, n }) => {
        return solveForked(input, part);
    });

    const cancelAll = () => {
        results.forEach(r => r.cancel());
    }

    const promises = fixtures.map(async ({input, expected, n}, i) => {
        const r = results[i]
        const actual = await r.promise;
        if (actual == expected) {
            return {input, expected, n, success: true, actual}
        } else {
            return {input, expected, n, success: false, actual}
        }
    });

    const resultsPromise = Promise.all(promises);
    return {resultsPromise, cancelAll};
}

export const isInputUnlocked = (config: PuzzleConfig) => {
    const target = new Date();
    target.setDate(config.day);
    target.setMonth(11); // Dec 
    target.setMinutes(0); // Dec 
    target.setHours(7); // Dec 
    target.setFullYear(config.year); // Dec 
    
    return Date.now() >= target.getTime();
}