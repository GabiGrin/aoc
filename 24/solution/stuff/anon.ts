
export const calcNum = (w, z, P1, P2, P3) => {
	// inp w
	let x = z % 26 // mul x 0
	// x = x + z// add x z
	// x = x % 26 // mod x 26
	z = Math.floor( z / P1 )// div z P1
	x = x + P2 // add x P2
	// x = x == w ? 1 : 0 // eql x w
	x = x == w ? 0 : 1 // eql x 0
	let y = (25 * x) + 1 // mul y 0
	// y = y + 25// add y 25
	// y = y * x// mul y x
	// y = y + 1// add y 1
	z = z * y// mul z y
	y = (w + P3) * x // mul y 0
	// y = y + w// add y w
	// y = y + P3// add y P3
	y = y * x// mul y x
	z = z + y// add z y
	return z;
  }