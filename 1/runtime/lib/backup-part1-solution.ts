import { readFileSync, writeFileSync } from 'fs';
import * as path from 'path';

const backupPath = path.resolve(__dirname, '../../__part1-solution._ts');
const currSolutionPath = path.resolve(__dirname, '../../solution/solve.ts');

export const backupPart1Solution = () => {
    const curr = readFileSync(currSolutionPath, 'utf-8');
    writeFileSync(backupPath, curr, 'utf-8');
}