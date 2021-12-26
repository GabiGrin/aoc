import { chunk, isDefined, range } from "./utils";

export const parseInput = (raw: string) => {
	return raw
		.split('\n')
		.map(n => {
			const [ins, v1, v2] = n.split(' ');
			return {ins, v1, v2};
		});	
}

export const run = (_pr: ReturnType<typeof parseInput>, input, z = 0) => {
	const digits = input;
	const vars: any = {z};
	const program = [..._pr];
	while (program.length) {
		const cmd = program.shift();
		// console.log({cmd});
		
		const getV2 = () => {
			const n = parseInt(cmd.v2);
			if (isNaN(n)) {
				return vars[cmd.v2] || 0;
			}
			return n;
		}
		const getV1 = () => {
			return vars[cmd.v1] || 0;
		}

		const getB = (v) => {
			const n = parseInt(v);
			if (isNaN(n)) {
				return vars[v] || 0;
			}
			return n;
		}
		switch (cmd.ins) {
			case 'inp':
				const val = digits.shift();
				if (!isDefined(val)) {
					throw new Error('bob')
				}
				
				vars[cmd.v1] = Number(val);
				break;
			case 'add':
				// console.log('b', getB(cmd.v2), cmd.v2);
				
				vars[cmd.v1] = getV1() + getV2();
				break;
			case 'mul':
				vars[cmd.v1] = getV1() * getV2();
				break;
			case 'div':
				vars[cmd.v1] = Math.floor(getV1() / getV2());
				break;
			case 'mod':
				vars[cmd.v1] = getV1() % getV2();
				break;
			case 'eql':
				vars[cmd.v1] = getV1() == getV2() ? 1 : 0;
				break;
			default:
				throw new Error('nope')
		}
		if (isNaN(vars[cmd.v1])) {
			console.log(cmd, vars, getB(cmd.v2));
			
			throw new Error('gg')
		}
	}

	return vars;

}

export const singleDigit = (d, z, program) => {
	return run(program, [d], z).z;
}



export const calcNumP1_26 = (digit, z, P2, P3) => {
	const something = (z % 26) + P2;
	const somethingElse = Math.floor(z / 26);

	if (something == digit) {
		return somethingElse;
	} else {
		return 26 * somethingElse + (digit + P3)
	}
}

export const calcNumP1_1 = (digit, z, P2, P3) => {
	const something = (z % 26) + P2;

	if (something == digit) {
		console.log('GOGOGOGOOGOGOGOGOG z condition!');
		
		return z;
	} else {
		return 26 * z + (digit + P3)
	}
}

let chunkVariantsGlobal


export const calcZ = (_pr: ReturnType<typeof parseInput>, model: string, returnLogs = false) => {

	const parts = chunk(_pr, 18);
	
	const chunkVariants = chunkVariantsGlobal || parts.reduce<any[]>((bob, chunk) => {
		
		chunk.forEach((row, i) => {
			const r = bob[i] || [];
			r.push(row.v2);
			bob[i] = r;
		})
		return bob;
	}, [])
	
	.map((r, i) => ({r, i}))
	.filter(e => {		
		return !e.r.every((v, i, self) => {
			return i === 0 || v === self[i - 1];
		})
	})
	.map(e => e.r.map(Number))

	chunkVariantsGlobal = chunkVariants;

	// console.log(chunkVariants);

	const logs = [];

	const result = model.split('').reduce((z, next, idx) => {
		const p1 = chunkVariants[0][idx]
		const p2 = chunkVariants[1][idx]
		const p3 = chunkVariants[2][idx]

		const digit = Number(next);

		const fun = p1 === 26 ? calcNumP1_26 : calcNumP1_1;
		const res = fun(digit, z, p2, p3);

		if (isNaN(res)) {
			console.log(z, idx, model)
			
		}
		
		// console.log(z, digit, p2,p3);
		logs.push({z, digit, p2, p3});

		//const P1 = [  1,  1,  1,  1,  1,  26,  26,  1, 26,  1, 26, 26,  26, 26 ]
		// const P2 = [ 14, 14, 14, 12, 15, -12, -12, 12, -7, 13, -8, -5, -10, -7 ]
        // const P3 = [ 14,  2,  1, 13,  5,   5,   5,  9,  3, 13,  2,  1,  11,  8 ]
		

		if (idx === 13 && res === 0) {
			// console.log(z);
			
		} 
		
		return res;
	}, 0)

	logs.push({result})

	if (returnLogs) {
		return logs
	}

	return result;
}

