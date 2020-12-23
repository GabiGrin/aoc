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

const findNode = (node, des) => {

	if (node.label === des) {
		return node;
	}
	let curr = node.right;

	while (curr !== node ){ 
		if (!curr) {
			throw 'bob  on ' + node.label;
		}
		if (curr.label === des) {
			return curr;
		}
		if (!curr.right) {
			throw 'bob  on ' + curr.label;
		}
		curr = curr.right;
	}
}

const detachRight = ( node) => {
	const right = node.right;
	node.right = null;
	right.left = null;
}

const detachLeft = ( node) => {
	const left = node.left;
	node.left = null;
	left.right = null;
}

export const solve = (raw: string, moves): any => {
	const input = parseInput(raw);

	const LENGTH = input.length;

	const nodes = input.map(label => ({label, left: null, right: null}));

	nodes.forEach((node, i) => {
		node.left = nodes[i - 1 > -1 ? i - 1: LENGTH - 1];
		node.right = nodes[(i + 1) % LENGTH];
	});

	const findNext = (node) => {
		let destination = node.label - 1;

		while (!findNode(node, destination)) {
			destination--;
			if (destination < 1) {
				destination = 9;
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

		const target = findNext(currNode);

		const destination =  findNode(currNode, target);
		
		if (!destination) {
			// console.log(print(currNode))
			throw new Error(`cant find cup ${currNode.label - 1} or 9 from ${currNode.label}`)
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
	console.log(cup1);

	// let r = '';
	return print(cup1).replace('1', '');
};

describe('bob', () => {	
	it('works for test case 1', () => {
		const input = `389125467`;

		// assert.equal(solve(input, 10), '92658374');
		assert.equal(solve(input, 100), '67384529');
	});

	// it('works for test case 2', () => {
	// 	const input = `HERE`;

	// 	assert.equal(solve(input), 424242);
	// });

	it('show the answer when ready!', () => {

		// const expected = 42;

		assert.equal(solve(puzzleInput, 100), 'bob');
	});
});

