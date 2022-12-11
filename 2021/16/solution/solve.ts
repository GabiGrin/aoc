// import { puzzleInput } from "../lib/lib";
import { assert } from "chai";
import { getTestCases } from "../runtime/lib/get-tests";
import { readInputFile } from "../runtime/lib/input-output-files";
import { simpleAdd, simpleMul } from "./utils/math";

const parseInput = (raw: string) => {
  const rows = raw.split("").reduce((acc, n) => {
    const b = parseInt(n, 16);
    // console.log(n, b);

    const bin = b.toString(2);

    // console.log(bin);

    const d = 4 - bin.length;

    const a = "0".repeat(d) + bin;
    // console.log(a);
    return [...acc, ...a.split("")];
  }, []);
  // .map(Number);
  // .map(v => v.split('').map(Number));

  // return gridFromMatix(rows);
  return rows;
};

export const solve = (raw: string): any => {
  const input = parseInput(raw);

  type Packet = { version: number; type: number; children: Packet[], num?: number };
  //   console.log(input);

  const parsePacket = (packet: string[], parent?: Packet): Packet => {
    if (packet.length === 0) {
      throw new Error("bob");
    }

    const versionStr = packet.splice(0, 3).join("");
    const typeStr = packet.splice(0, 3).join("");

    const version = parseInt(versionStr, 2);
    const type = parseInt(typeStr, 2);

    const info = { version, type, children: [] };

    if (type === 4) {
      let numStr = "";

      let last = false;
      while (!last) {
        const [t, ...rest] = packet.splice(0, 5);
        console.log(t, rest);

        numStr += rest.join("");
        last = t === "0";
      }
      const num = parseInt(numStr, 2);
      return { ...info, num };
    }

    const lengthType = parseInt(packet.splice(0, 1).join(""), 2);

    if (lengthType === 0) {
      const nextPacketsLength = parseInt(packet.splice(0, 15).join(""), 2);

      console.log(nextPacketsLength);

      const nextBits = packet.splice(0, nextPacketsLength);

      const children = [];
      while (nextBits.length) {
        children.push(parsePacket(nextBits));
      }

      return { ...info, children };
    } else {
      const subPacketCount = parseInt(packet.splice(0, 11).join(""), 2);

      const children = [];
      while (children.length < subPacketCount) {
        children.push(parsePacket(packet));
      }
      // children.push(parsePacket(packet));
      return { ...info, children };
    }
  };

  /*

  Packets with type ID 0 are sum packets - their value is the sum of the values of their sub-packets. If they only have a single sub-packet, their value is the value of the sub-packet.
Packets with type ID 1 are product packets - their value is the result of multiplying together the values of their sub-packets. If they only have a single sub-packet, their value is the value of the sub-packet.
Packets with type ID 2 are minimum packets - their value is the minimum of the values of their sub-packets.
Packets with type ID 3 are maximum packets - their value is the maximum of the values of their sub-packets.
Packets with type ID 5 are greater than packets - their value is 1 if the value of the first sub-packet is greater than the value of the second sub-packet; otherwise, their value is 0. These packets always have exactly two sub-packets.
Packets with type ID 6 are less than packets - their value is 1 if the value of the first sub-packet is less than the value of the second sub-packet; otherwise, their value is 0. These packets always have exactly two sub-packets.
Packets with type ID 7 are equal to packets - their value is 1 if the value of the first sub-packet is equal to the value of the second sub-packet; otherwise, their value is 0. These packets always have exactly two sub-packets.

*/

  const calcSum = (p: Packet) => {

	console.log(p);
	

	if (p.type === 4) {
		return p.num;
	}

	const opMap = {
		0: (...n) => n.reduce(simpleAdd),
		1: (...n) => n.reduce(simpleMul),
		2: (...n) => Math.min(...n),
		3: (...n) => Math.max(...n),
		5: (...n) => {
			if (n.length !== 2) {
				throw new Error('oops')
			}
			return n[0] > n[1] ? 1 : 0;
		},
		6: (...n) => {
			if (n.length !== 2) {
				throw new Error('oops')
			}
			return n[0] < n[1] ? 1 : 0;
		},
		7: (...n) => {
			if (n.length !== 2) {
				throw new Error('oops')
			}
			return n[0] == n[1] ? 1 : 0;
		}
	}


	const op = opMap[p.type];

	const values = p.children.map(p => calcSum(p));

	console.log(values);

	return op(...values);
	
	
	
	

    // const childSums = p.children.reduce((acc, p) => {
		
    //   return acc + calcVersions(p);
    // }, 0);

    // return p.version + childSums;
  };

  const info = parsePacket(input);
  




  return calcSum(info);
};

// for wallaby
describe("part 1 tests", () => {
  it.only("passes for case 1 if exists", () => {
    const case1 = getTestCases()[0];
    if (case1) {
      const actual = solve(case1.input);
      assert.equal(actual, case1.expected);
    } else {
      // no test case
    }
  });

  it("passes for case 2 if exists", () => {
    const case1 = getTestCases()[1];
    if (case1) {
      const actual = solve(case1.input);
      assert.equal(actual, case1.expected);
    } else {
      // no test case
    }
  });

  it("passes for case 3 if exists", () => {
    const case3 = getTestCases()[2];
    if (case3) {
      const actual = solve(case3.input);
      assert.equal(actual, case3.expected);
    } else {
      // no test case
    }
  });

  it("passes for case 4 if exists", () => {
    const case4 = getTestCases()[3];
    if (case4) {
      const actual = solve(case4.input);
      assert.equal(actual, case4.expected);
    } else {
      // no test case
    }
  });

  it("passes for case 5 if exists", () => {
    const case5 = getTestCases()[4];
    if (case5) {
      const actual = solve(case5.input);
      assert.equal(actual, case5.expected);
    } else {
      // no test case
    }
  });

  it("passes input if exists", () => {
    // const input = readInputFile();
    // const actual = solve(input);
    // console.log({actual});
  });
});