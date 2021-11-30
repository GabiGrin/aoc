import { readdirSync, readFileSync } from "fs";
import { seq } from "../../solution/utils";

const getTestCase = (n) => {
    const input = readFileSync(`./tests/case${n}-input`, 'utf-8');
    const expected = readFileSync(`./tests/case${n}-output`, 'utf-8');
    return {input, expected, n};
}

export const getTestCases = () => {
    const max = readdirSync(`./tests`).length / 2;
    return seq(max).map((i) => {
        try {
            return getTestCase(i + 1);
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