// import { puzzleInput } from "../lib/lib";
import {assert} from 'chai';
import { getTestCases } from '../runtime/lib/get-tests';
import { readInputFile } from '../runtime/lib/input-output-files';
import { isDefined } from './utils';



type DataNode = {
	value: number;
	parent: BiNode;
	type: 'data';
}

type BiNode = {
	left: Node;
	right: Node;
	parent: BiNode;
	type: 'parent'
};

type Node = DataNode | BiNode;

// type Node = ParentNode | DataNode;

const stringToNode = (str: string): BiNode => {
	const chars = str.split('');
			
	let currNode: Node;

	while (chars.length) {
		const next = chars.shift();

		if (next === '[') {
			if (currNode) {
				if (currNode.type === 'data') {
					throw 'wat';
				}
				const newNode: Node = {left: undefined, right: undefined, parent: currNode, type: 'parent'} as Node;
				if (isDefined(currNode.left)) {
					currNode.right = newNode
				} else {
					currNode.left = newNode;
				}
				currNode = newNode;
				// 
			} else {
				currNode = {left: undefined, right: undefined, parent: undefined, type: 'parent'} as any
			}
		} else if (next === ']') {
			if (chars.length === 0) {
				break;
			}
			currNode = currNode.parent;
		} else if (next === ',') {

		} else {
			let val = next;
			while (chars[0].match(/\d/)) {
				val+= chars.shift();
			}

			if (currNode.type !== 'parent') {
				throw 'bob';
			}

			const newNode: DataNode = {value: Number(val), type: 'data', parent: currNode};
			if (currNode.left) {
				currNode.right = newNode
			} else {
				currNode.left = newNode;
			}
		}
	}

	return currNode as BiNode;
}

const parseInput = (raw: string) => {
	const rows = raw
		.split('\n')
		.map(n => n.trim())
		.filter((v) => !!v)
		.map(stringToNode)

	return rows;
}

const print = (node: Node): string => {		
	if (node.type === 'data') {
		return `${node.value}`;
	}
	return `[${print(node.left)},${print(node.right)}]`;
}

const add = (n1: Node, n2: Node) => {
	const s1 = print(n1);
	const s2 = print(n2);
	const ns = `[${s1},${s2}]`;
	return stringToNode(ns);
}

const magnitude = (node: Node): number => {	
	if (node.type === 'data') {
		return node.value;
	}
	return 3 * magnitude(node.left) + 2 * magnitude(node.right);
}

const maybeSplit = (node: BiNode) => {

	const ordered = orderedNodes(node);
	

	let did = false;
	while (ordered.length) {
		const n = ordered.shift();

		if (n.type === 'data') {
			
			if (n.value > 9) {
				// console.log(n, parent);
				
				const newNum = n.value / 2;
				const left = Math.floor(newNum);
				const right = Math.ceil(newNum);
				// console.log('found split!', n, 'into', {left, right});
				const newNode: BiNode = {left: null, right: null, parent: null, type: 'parent'};
				newNode.left = {value: left, parent: newNode, type: 'data'}
				newNode.right = {value: right, parent: newNode, type: 'data'}

				
				if (n === n.parent.left) {
					n.parent.left = newNode;
					newNode.parent = n.parent;
				} else {
					n.parent.right = newNode;
					newNode.parent = n.parent;
				}
				return true;
			
			}
		}
	}

	return did;
}

const orderedNodes = (node: Node): DataNode[] => {

	if (node.type === 'data') {
		return [node];
	}

	return [...orderedNodes(node.left), ...orderedNodes(node.right)];
}

const maybeExplode = (node: BiNode) => {

	const ordered = orderedNodes(node);

	const queue = [
		{node: node.left, level: 1},
		{node: node.right, level: 1},
	];


	while (queue.length) {
		
		const currNode = queue.shift();
		const {node, level} = currNode;
		
		if (level === 5) {
			const left = node.parent.left;
			const right = node.parent.right;

			// console.log(left.value, right.value);
			
			
			const leftIdx = ordered.findIndex(item => item === left);
			const rightIdx = ordered.findIndex(item => item === right);
			console.log({leftIdx, rightIdx});


			const leftNode = ordered[leftIdx - 1];
			const rightNode = ordered[rightIdx + 1];

			if (left.type !== 'data') {
				throw 'wat';
			}

			if (right.type !== 'data') {
				throw 'wat';
			}
			
			if (leftNode) {
				console.log(leftNode.value);
				
				leftNode.value = leftNode.value + left.value;
			}

			if (rightNode) {
				rightNode.value = rightNode.value + right.value;
				console.log(rightNode.value);
			}

			if (node.parent === node.parent.parent.left) {	
				// console.log(print(node.parent));
				// console.log(print(node.parent.parent));
				
				node.parent.parent.left = {value: 0, parent: node.parent.parent, type: 'data'}
			} else {
				node.parent.parent.right = {value: 0, parent: node.parent.parent, type: 'data'}
			}

			return true;
		} 

		if (node.type === 'parent') {
			queue.push({node: node.left, level: level + 1});
			queue.push({node: node.right, level: level + 1})
		}	
	}

	return false;
}


export const solve = (raw: string): any => {
	const input = parseInput(raw);


	const reduce = (node) => {
		let ok = true;

		while (ok) {
			ok = maybeExplode(node);
		}

		const bob = maybeSplit(node);
		

		if (bob) {
			return reduce(node);
		}
		return node;
	}

	// reduce(input[4])

	// console.log(input[4]);
	


	let max = 0;

	input.forEach(i1 => {

		input.forEach(i2 => {

			if (i1 !== i2) {
				const sum = add(i1, i2);
				reduce(sum);
				const mag = magnitude(sum);
				max = Math.max(mag, max);
			}
		})
	})

	return max;


};

// for wallaby
describe('part 1 tests', () => {

	describe('utils', () => {
		it('add', () => {
			

			const n1 = stringToNode('[1,2]');
			const n2 = stringToNode('[[3,4],5]');
			const added = add(n1, n2)
			assert.equal(print(added), '[[1,2],[[3,4],5]]')
		})

		it('explode', () => {
	
			const n1 = stringToNode('[[[[[9,8],1],2],3],4]');
			maybeExplode(n1);
			assert.equal(print(n1), '[[[[0,9],2],3],4]')

			const n2 = stringToNode('[7,[6,[5,[4,[3,2]]]]]');
			maybeExplode(n2);
			assert.equal(print(n2), '[7,[6,[5,[7,0]]]]')

			const n3 = stringToNode('[[6,[5,[4,[3,2]]]],1]');
			maybeExplode(n3);
			assert.equal(print(n3), '[[6,[5,[7,0]]],3]')

			const n4 = stringToNode('[[3,[2,[1,[7,3]]]],[6,[5,[4,[3,2]]]]]');
			maybeExplode(n4);
			assert.equal(print(n4), '[[3,[2,[8,0]]],[9,[5,[4,[3,2]]]]]')

			const n5 = stringToNode('[[3,[2,[8,0]]],[9,[5,[4,[3,2]]]]]');
			maybeExplode(n5);
			assert.equal(print(n5), '[[3,[2,[8,0]]],[9,[5,[7,0]]]]')
		})

		it('split', () => {
			
			/*
			after addition: [[[[[4,3],4],4],[7,[[8,4],9]]],[1,1]]
after explode:  [[[[0,7],4],[7,[[8,4],9]]],[1,1]]
after explode:  [[[[0,7],4],[15,[0,13]]],[1,1]]
after split:    [[[[0,7],4],[[7,8],[0,13]]],[1,1]]
after split:    [[[[0,7],4],[[7,8],[0,[6,7]]]],[1,1]]
after explode:  [[[[0,7],4],[[7,8],[6,0]]],[8,1]]
			*/
			const n1 = stringToNode('[[[[0,7],4],[15,[0,13]]],[1,1]]');
			maybeSplit(n1);
			assert.equal(print(n1), '[[[[0,7],4],[[7,8],[0,13]]],[1,1]]')

			// const n2 = stringToNode('[7,[6,[5,[4,[3,2]]]]]');
			// maybeExplode(n2);
			// assert.equal(print(n2), '[7,[6,[5,[7,0]]]]')

			// const n3 = stringToNode('[[6,[5,[4,[3,2]]]],1]');
			// maybeExplode(n3);
			// assert.equal(print(n3), '[[6,[5,[7,0]]],3]')

			// const n4 = stringToNode('[[3,[2,[1,[7,3]]]],[6,[5,[4,[3,2]]]]]');
			// maybeExplode(n4);
			// assert.equal(print(n4), '[[3,[2,[8,0]]],[9,[5,[4,[3,2]]]]]')

			// const n5 = stringToNode('[[3,[2,[8,0]]],[9,[5,[4,[3,2]]]]]');
			// maybeExplode(n5);
			// assert.equal(print(n5), '[[3,[2,[8,0]]],[9,[5,[7,0]]]]')
		})

	})

	it.only('passes for case 1 if exists', () => {
		const case1 = getTestCases()[0];
		if (case1) {
			const actual = solve(case1.input);			
			assert.equal(actual, case1.expected);
		} else {
			// no test case
		}
	});

	it('passes for case 2 if exists', () => {
		const case2 = getTestCases()[1];
		if (case2) {
			const actual = solve(case2.input);
			assert.equal(actual, case2.expected);
		} else {
			// no test case
		}
	});

	it('passes for case 3 if exists', () => {
		const case3 = getTestCases()[2];
		if (case3) {
			const actual = solve(case3.input);
			assert.equal(actual, case3.expected);
		} else {
			// no test case
		}
	});

	it('passes for case 4 if exists', () => {
		const case4 = getTestCases()[3];
		if (case4) {
			const actual = solve(case4.input);
			assert.equal(actual, case4.expected);
		} else {
			// no test case
		}
	});

	it('passes for case 5 if exists', () => {
		const case5 = getTestCases()[4];
		if (case5) {
			const actual = solve(case5.input);
			assert.equal(actual, case5.expected);
		} else {
			// no test case
		}
	});

	it('passes input if exists', () => {
		// const input = readInputFile();
		
		
		// const actual = solve(input);
		// console.log({actual});
	});
})
