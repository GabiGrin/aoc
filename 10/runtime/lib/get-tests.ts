import { readdirSync, readFileSync } from "fs";
import { notify } from "./notifier";

const getTestCase = (n) => {
    const input = readFileSync(`./tests/case${n}-input`, 'utf-8');
    const expected = readFileSync(`./tests/case${n}-output`, 'utf-8');
    return {input, expected, n};
}

export const getTestCases = () => {
    const max = readdirSync(`./tests`).length / 2;

    return 'X'.repeat(max).split('').map((_, i) => {
        try {
            return getTestCase(i + 1);
        } catch (e) {
            console.error('Original error', e);
            throw new Error(`Unable to read fixture number ${i}. Make sure you have a pair number of input and outputs and they are properly named.`);
        }
    })
    .filter(({input, expected, n}) => {
        if (input === 'TBD' && expected) {
            notify(`You haven't entered an input for case ${n} but entered an expected value. This is probably a mistake. Fix this.`);
            return false;
        }

        return input !== 'TBD';
    });
}