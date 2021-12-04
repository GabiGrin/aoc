2// import { puzzleInput } from "../lib/lib";
import {assert} from 'chai';
import { clearLine } from 'readline';
import { getTestCases } from '../runtime/lib/get-tests';
import { readInputFile } from '../runtime/lib/input-output-files';
import { chunk, mapMatrix, reduceMatrix, rotateMatrixClockWise } from './utils';

const parseInput = (raw: string) => {
	const rows = raw
		.split('\n')
		.map(n => n.trim())
		.filter((v) => !!v);

	const [first, ...rest] = rows;

	const numbers = first.split(',').map(Number);	
	const tickets = chunk(rest.map(row => row.split(/\s+/).map(Number)), 5)
	return {tickets, numbers};
}

export const solve = (raw: string): any => {
	let {numbers, tickets} = parseInput(raw);

	const applyNumber = (ticket, number) => mapMatrix(ticket, v => v === number ? 'x' : v);
	const hasFullRow = ticket => ticket.filter(r => r.every(c => c === 'x')).length > 0;;

	const hasWon = (ticket) => hasFullRow(ticket) || hasFullRow(rotateMatrixClockWise(ticket));

	const findLast = (tickets, [num, ...rest]: number[]) => {
		const [num, ...rest] = numbers;
		const playTickets = tickets.map(t => applyNumber(t, num));

		if (playTickets.length === 1 && hasWon(playTickets[0])) {
			return {ticket: playTickets[0], number: num}
		} else {
			const remaining = playTickets.filter(t => !hasWon(t));
			return findLast(remaining, rest);
		}
	}

	const {ticket, number} = findLast(tickets, numbers);
	const remaining = reduceMatrix(ticket, (acc, cell: any) => acc + (cell === 'x' ? 0 : cell), 0);

	return remaining * number;
};

// for wallaby
describe('part 1 tests', () => {
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
		const input = readInputFile();
		
		
		const actual = solve(input);
		console.log({actual});
		assert.equal(actual, 2)
	});
})
