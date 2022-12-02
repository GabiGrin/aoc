import { fork } from "child_process";
import * as path from 'path';

const FORK_TIMEOUT = 5000;

export const forkedSolve = (input: string) => {
    const tsNodePath = require.resolve(`ts-node`);
    const forkPath = path.resolve(__dirname, './solve.child-process.ts');
    const child = fork(forkPath, [], {
        execArgv: [ tsNodePath.replace('index.js', 'bin.js')]
    });

    let timeoutTimer;
    const promise = new Promise<string>((res, rej) => {
        child.on('message', (message) => {
            if (typeof message.solution !== 'undefined') {
                    res(message.solution);
                    child.kill(0);
                } else {
                    console.log(`unknown message`, message, 'received');
                }
        });
        child.send({solve: input});
        
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