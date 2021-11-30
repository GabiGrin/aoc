import { readdirSync, writeFileSync } from 'fs';
import * as path from 'path';

const testsPath = path.resolve(__dirname, `../../tests`);

export const resetTests = () => {
    const files = readdirSync(testsPath);
    files.forEach((file) => {
        const newContent = file.includes('input') ? 'TBD' : '';
        writeFileSync(path.resolve(testsPath, file), newContent, 'utf-8');
    });
}