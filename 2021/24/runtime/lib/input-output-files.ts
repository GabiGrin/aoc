import { existsSync, readFileSync, writeFileSync } from 'fs';
import * as path from 'path';
import { PuzzlePart } from './aoc-api';

const inputPath = path.resolve(__dirname, '../../input.txt');

const outputPath = (part: PuzzlePart) => path.resolve(__dirname, `../../output-pt${part}.txt`);

export const hasInputFile = () => {
    return existsSync(inputPath);
}
export const readInputFile = () => {
    return readFileSync(inputPath, 'utf-8');
}

export const writeInputFile = (inputData: string) => {
    writeFileSync(inputPath, inputData, 'utf-8');
}

export const writeOutputFile = (part: PuzzlePart, outputData: string) => {
    writeFileSync(outputPath(part), outputData, 'utf-8');
}