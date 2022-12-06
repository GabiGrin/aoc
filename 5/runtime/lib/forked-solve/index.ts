import { fork } from "child_process";
import * as path from "path";
import { notify } from "../notifier";

const FORK_TIMEOUT = 5000;

export const forkedSolve = (input: string) => {
  const tsNodePath = require.resolve(`ts-node`);
  const forkPath = path.resolve(__dirname, "./solve.child-process.ts");
  const child = fork(forkPath, [], {
    execArgv: [tsNodePath.replace("index.js", "bin.js")],
  });

  let timeoutTimer;
  const promise = new Promise<string>((res, rej) => {
    child.on("message", (message) => {
      if (typeof message.error !== "undefined") {
        notify("Solver thrown an error: " + message.error);
        rej(new Error(message.error));
        child.kill(0);
      } else if (typeof message.solution !== "undefined") {
        res(message.solution);
        child.kill(0);
      } else {
        console.log(`unknown message`, message, "received");
      }
    });

    child.on('exit', (code, signal) => {
      if (code !==0) {
        rej(new Error('process exited'));
      }
      
      // console.log(code);
      // console.log(signal);
    });

    child.on('error', (error) => {
      rej(error);
      child.kill(0);
    })
    child.send({ solve: input });

    timeoutTimer = setTimeout(() => {
      rej(`Timeout`);
    }, FORK_TIMEOUT);
  });

  return {
    promise,
    cancel: () => {
      console.log("killing process");
      clearTimeout(timeoutTimer);
      child.kill("SIGINT");
    },
  };
};
