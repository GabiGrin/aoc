import { delay } from "../solution/utils";
import { AocClient } from "./lib/aoc-api";
import { hasInputFile, writeInputFile } from "./lib/input-output-files";
import { notify } from "./lib/notifier";

const RETRY_TIME = 10000;

export const initInputDownloader = async (client: AocClient) => {
    if (hasInputFile()) {
      notify(`Input file already exists! not downloading`);
    } else {
      const attempt = async () => {
        if (client.isInputUnlocked()) {
          try {
            const input = await client.getInput();
            writeInputFile(input);
            notify(`Input downloaded and copied to input.txt!`);
            return true;
          } catch (e) {
            console.error(e);
            notify(`Error downloading input - ${e}, trying again in 10 seconds`);
            return false;
          }
        } else {
          // notify(`Input is not ready yet, trying again in ${RETRY_TIME / 1000} seconds`);
          return false;
        }
      };
  
      let success = await attempt();
      while (!success) {
        await delay(RETRY_TIME);
        success = await attempt();
      }
    }
  };