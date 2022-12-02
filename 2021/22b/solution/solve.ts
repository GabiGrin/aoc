// import { puzzleInput } from "../lib/lib";
import {assert} from 'chai';
import { getTestCases } from '../runtime/lib/get-tests';
import { readInputFile } from '../runtime/lib/input-output-files';
import { breakOffs, Cubiod, cuts2, intersects } from './lib';

const parseInput = (raw: string) => {
	const rows = raw.split("\n").map((n) => {
	  const [_, ins, ...rest] = n.match(
		/(on|off).*x=(-?\d+)\.\.(-?\d+),y=(-?\d+)\.\.(-?\d+),z=(-?\d+)\.\.(-?\d+)/
	  );
	  const [fx, tx, fy, ty, fz, tz] = rest.map(Number).map((n) => {
		return n;
		// return Math.max(-50, Math.min(n, 50));
	  });
	  // console.log({fx, tx,fy,ty,fz,tz, ins});
	  return { x: [fx, tx + 1], y: [fy, ty + 1], z: [fz, tz + 1], ins } as Cubiod;
	});
  
	return rows;
  };
export const solve = (raw: string): any => {
	const input = parseInput(raw);

	let cubesOn = breakOffs([...input]);
  	console.log(cubesOn.length)

	return input.length;
};

// for wallaby
describe('part 1 tests', () => {

	it('cus properly', () => {
		const c1: Cubiod = {x: [0,2], y: [1, 2], z: [1, 2], ins: 'on'}
		const c2: Cubiod = {x: [1,3], y: [1, 2], z: [1, 2], ins: 'on'}

		assert.equal(intersects(c1, c2), true);

		const {a, b, overlap} = cuts2(c1, c2);
		console.log(a);
		console.log(b);
		console.log(overlap);
		
		
	})
	it('passes for case 1 if exists', () => {

		assert.equal(solve(`on x=10..12,y=10..12,z=10..12
		on x=11..13,y=11..13,z=11..13
		off x=9..11,y=9..11,z=9..11`), 38)
	});

})
