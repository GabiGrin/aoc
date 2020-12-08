import { puzzleInput } from "./puzzle-input";
import {assert} from 'chai';

const toNums = str => str.map(Number);

export const solve = (input: string): any => {

	const fields =  ['byr',
	'iyr',
	'eyr',
	'hgt',
	'hcl',
	'ecl',
	'pid',
	'cid'];
	const pp = input.split('\n\n');
	// console.log(pp);

	/*
	byr (Birth Year) - four digits; at least 1920 and at most 2002.
iyr (Issue Year) - four digits; at least 2010 and at most 2020.
eyr (Expiration Year) - four digits; at least 2020 and at most 2030.
hgt (Height) - a number followed by either cm or in:
If cm, the number must be at least 150 and at most 193.
If in, the number must be at least 59 and at most 76.
hcl (Hair Color) - a # followed by exactly six characters 0-9 or a-f.
ecl (Eye Color) - exactly one of: amb blu brn gry grn hzl oth.
pid (Passport ID) - a nine-digit number, including leading zeroes.
cid (Country ID) - ignored, missing or not.
*/

const validations = {
	byr: (d) => {
		if (!/\d{4}/.test(d)) {
			return false;
		}
		d = parseInt(d, 10);
		return d >= 1920 && d <= 2002
	},
	iyr: (d) => {
		// console.log(d);
		if (!/\d{4}/.test(d)) {
			return false;
		}
		d = parseInt(d, 10);
		return d >= 2010 && d <= 2020;
	},
	eyr: (d) => {
		// console.log(d);
		if (!/\d{4}/.test(d)) {
			return false;
		}
		d = parseInt(d, 10);
		return d >= 2020 && d <= 2030;
	},
	hgt: (h) => {
		// console.log(h);
		if (!(/\d\d\dcm/.test(h) || /\d\din/.test(h))) {
			console.log(h);
			return false;
		}
		const num = parseInt(h);
		if (h.includes('cm')) {
			return num >= 150 && num <= 193;
		} else if (h.includes('in')) {
			return num >= 59 && num <= 76;
		} else {
			throw 'bv';
		}
	},
	hcl: (c) => {
		// console.log(c);
		if (/^#[0-9a-f]{6}$/i.test(c)) {
			// console.log(c);
			return true;
		}
		// console.log(c);
	},
	ecl: (c) => {
		if ('amb blu brn gry grn hzl oth'.split(' ').includes(c)) {
			return true;
		};
	},
	pid: (c) => {
		if (/^[0-9]{9}$/i.test(c)) {
			return true;
		};
		return false;
	},
	cid: (c) => true
}

	const pt = pp.map((p) => {
		const r = p.split('\n').join(' ');
		const pairs = r.split(' ');
		const map = pairs.reduce((acc, curr) => {
			const [k, v] = curr.split(':');
			acc[k] = v;
			return acc;
		}, {});

		// console.log(map);
	
		const va = Object.keys(validations);

		const mk = Object.keys(map);

		const valid = va.every((kv) => {
			const val = validations[kv];

			return val(map[kv]);
		});

		return valid;

		// console.log(valid, map);
	});

			/*
byr (Birth Year) - four digits; at least 1920 and at most 2002.
iyr (Issue Year) - four digits; at least 2010 and at most 2020.
eyr (Expiration Year) - four digits; at least 2020 and at most 2030.
hgt (Height) - a number followed by either cm or in:
If cm, the number must be at least 150 and at most 193.
If in, the number must be at least 59 and at most 76.
hcl (Hair Color) - a # followed by exactly six characters 0-9 or a-f.
ecl (Eye Color) - exactly one of: amb blu brn gry grn hzl oth.
pid (Passport ID) - a nine-digit number, including leading zeroes.
cid (Country ID) - ignored, missing or not.

	})
	*/
	return pt.filter(c => !!c).length;
};

describe('bob', () => {	
	it('works for test case 1', () => {
		const input = `eyr:1972 cid:100
hcl:#18171d ecl:amb hgt:170 pid:186cm iyr:2018 byr:1926

iyr:2019
hcl:#602927 eyr:1967 hgt:170cm
ecl:grn pid:012533040 byr:1946

hcl:dab227 iyr:2012
ecl:brn hgt:182cm pid:021572410 eyr:2020 byr:1992 cid:277

hgt:59cm ecl:zzz
eyr:2038 hcl:74454a iyr:2023
pid:3556412378 byr:2007`;

		assert.equal(solve(input), 0);
	});

	it('works for test case 2', () => {
		const input = `pid:087499704 hgt:74in ecl:grn iyr:2012 eyr:2030 byr:1980
hcl:#623a2f

eyr:2029 ecl:blu cid:129 byr:1989
iyr:2014 pid:896056539 hcl:#a97842 hgt:165cm

hcl:#888785
hgt:164cm byr:2001 iyr:2015 cid:88
pid:545766238 ecl:hzl
eyr:2022

iyr:2010 hgt:158cm hcl:#b6652a ecl:blu byr:1944 eyr:2021 pid:093154719`;

		assert.equal(solve(input), 4);
	});

	// it('works for test case 3', () => {
	// 	const input = `HERE`;

	// 	assert.equal(solve(input), 424242);
	// });

	it('show the answer when ready!', () => {

		// const expected = 42;

		assert.equal(solve(puzzleInput), 158);
	});
});

