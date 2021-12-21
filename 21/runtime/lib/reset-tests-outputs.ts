import { readdirSync, writeFileSync } from "fs";
import * as path from "path";

const testsPath = path.resolve(__dirname, `../../tests`);

export const resetTestsOutputs = () => {
  const files = readdirSync(testsPath);
  files
    .filter((f) => f.includes("output"))
    .forEach((file) => {
      writeFileSync(path.resolve(testsPath, file), '', "utf-8");
    });
};
