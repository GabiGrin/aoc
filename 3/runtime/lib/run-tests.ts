import { forkedSolve } from "./forked-solve";
import { getTestCases } from "./get-tests";

export const runTests = () => {

    const fixtures = getTestCases();

    const results = fixtures.map(({input }) => {
        return forkedSolve(input);
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