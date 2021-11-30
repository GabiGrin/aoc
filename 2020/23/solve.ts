import { puzzleInput } from "./puzzle-input";
import {assert} from 'chai';
import { setCell } from "./utils";


const parseInput = (raw: string) => {
	return raw.split('').map(Number);
}

const print = (node) => {

	let res = node.label;
	let curr = node.right;

	while (curr !== node){ 
		res = `${res}${curr.label}`;
		curr = curr.right;
	}
	return res;
}


export const solve = (raw: string, moves = 10000000, totalItems = 1000000): any => {
	const input = parseInput(raw);

	let lastMax = 10;
	while (input.length !== totalItems) {
		input.push(lastMax++);
	}
	// console.log('done with arrya', input);

	const LENGTH = input.length;

	const nodes = input.map(label => ({label, left: null, right: null}));

	const map = new Map();

	const findNode = (node, des) => {

		// if (node.label === des) return node;
		// let curr = node.right;
		// while (curr !== node ) {
		// 	if (curr.label === des) return curr;
		// 	curr = curr.right;
		// }
		// throw new Error (`No node ${des}`);
		return map.get(des);
	}

	nodes.forEach((node, i) => {
		node.left = nodes[i - 1 > -1 ? i - 1: LENGTH - 1];
		node.right = nodes[(i + 1) % LENGTH];

		if (map.get(node.label)) {
			throw 'bob'
		}
		map.set(node.label, node);
	});

	// console.log('done with nodes');

	const findNext = (node, disabled) => {
		let destination = node.label - 1;

		while (disabled.includes(destination) || destination < 1) {
			destination--;
			if (destination < 1) {
				destination = totalItems;
			}
		}
		return destination;
	}

	// const node = {left: }
	let currNode = nodes[0];
	
	for (let i = 0; i < moves; i++) {

		const nextPartialCups = [currNode.right, currNode.right.right, currNode.right.right.right];

		// console.log(print(currNode), nextPartialCups.map((n) => n.label));
		// return;
		nextPartialCups[0].left = null;

		currNode.right = nextPartialCups[2].right;

		nextPartialCups[2].right = null;

		const target = findNext(currNode, nextPartialCups.map(c => c.label));

		// console.log(target);

		const destination =  findNode(currNode, target);
		
		if (!destination) {
			// console.log(print(currNode))
			throw new Error(`cant find cup ${target} from ${currNode.label}`)
		} else {
			// console.log('found', destination.label);
		}

		nextPartialCups[2].right = destination.right;
		nextPartialCups[0].left = destination;

		destination.right = nextPartialCups[0];


		// console.log(currNode.label, print(currNode), currNode.right.label, currNode.left.label);


		currNode = currNode.right;
	}
	
	console.log(currNode.label);

	const cup1 = findNode(currNode, 1);

	console.log(cup1.right.label, cup1.right.right.label);
	const nexts = [cup1.right, cup1.right.right];
	return nexts[0].label * nexts[1].label;

	// return print(cup1).replace('1', '');
};

describe('bob', () => {	
	it('works for test case 1', () => {
		const input = `389125467`;
		// assert.equal(solve(input, 10, 9), '92658374');
		// assert.equal(solve(input, 100, 9), '67384529');
		assert.equal(solve(input), 149245887792);
	});

	// it('works for test case 2', () => {
	// 	const input = `HERE`;

	// 	assert.equal(solve(input), 424242);
	// });

	it('show the answer when ready!', () => {

		// const expected = 42;

		// assert.equal(solve(puzzleInput, 100), 'bob');
	});
});

