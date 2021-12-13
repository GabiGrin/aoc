import { PuzzleState } from "./aoc-api";
import * as path from 'path';
import { existsSync, readFileSync, writeFileSync } from "fs";
import { assert } from "console";

const stateFilePath = path.resolve(__dirname, '../../.last-state');

export const setLastState = (state: PuzzleState) => {
    writeFileSync(stateFilePath, `${state}`, 'utf-8');
}

export const getLastState = (): PuzzleState => {
    if (existsSync(stateFilePath)) {
        const raw = readFileSync(stateFilePath, 'utf-8');
        assert(['1', '2', 'done'].includes(raw), `Invalid state file content ${raw}`);
        return raw as PuzzleState;
    }
    return '1';
}