import { PuzzleConfig } from "./puzzle-config"
import { AocClient } from 'advent-of-code-client';
import axios from 'axios';
import { exec } from "child_process";

export type PuzzlePart = '1' | '2';
export type PuzzleState = PuzzlePart | 'done';

export const createAocClient = ({year, day, token}: PuzzleConfig) => {
    const client = new AocClient({year, day, token});
    
    return {
        getInput: () => client.getInput(),
        submitAnswer: (part: PuzzlePart, answer) => {
            return client.submit(Number(part), answer);
        },
        currentPart: async (): Promise<PuzzleState> => {
            const raw = (await axios.get(`https://adventofcode.com/${year}/day/${day}`, {
                headers: {
                    cookie: `session=${token}`
                }
            })).data;

            if (raw.includes('Both parts of this puzzle are complete!')) {
                return 'done'
            } else if (raw.includes('The first half of this puzzle is complete!')) {
                return '2';
            } else {
                return '1';
            }
        },
        isInputUnlocked: () => {
            const target = new Date();
            target.setDate(day);
            target.setMonth(11); // Dec, month is 0 based :face-palm:
            target.setMinutes(0);
            target.setSeconds(5); // a few seconds tobeonthesafeside
            target.setHours(7);
            target.setFullYear(year);
    
            return Date.now() >= target.getTime();
        },
        openRiddleInBrowser: () => {
            const url = `https://adventofcode.com/${year}/day/${day}`;
            exec(`open ${url}`);
        }
    }
}

export type AocClient = ReturnType<typeof createAocClient>;