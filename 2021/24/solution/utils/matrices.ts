export type Matrix<T> = Array<Array<T>>;

export const rotateMatrixClockWise = <T>(mat: Matrix<T>) => {
	return mat[0].map((_, index) => (
		mat.map(row => row[index])
	)).reverse();
}

export const reduceMatrix = <T, Acc>(mat: Matrix<T>, reducer: (acc: Acc, curr: T, rowIdx: number, colIdx: number, mat: Matrix<T>) => Acc, init: Acc): Acc => {
	let accVal = init;
	for (let rowIdx = 0; rowIdx < mat.length; rowIdx++) {
		const row = mat[rowIdx];
		
		for (let colIdx = 0; colIdx < row.length; colIdx++) {
			const cell = row[colIdx];
			accVal = reducer(accVal, cell, rowIdx, colIdx, mat);
		}
	}
	return accVal;
}

export const mapMatrix = <T, K>(mat: Matrix<T>, map: (curr: T, rowIdx: number, colIdx: number, mat: Matrix<T>) => K): Matrix<K> => {
	return mat.map((row, rowIdx) => {
		return row.map((cell, colIdx) => {
			return map(cell, rowIdx, colIdx, mat);
		})
	});
}

export const forEachMatrix = <T, K>(mat: Matrix<T>, fn: (curr: T, rowIdx: number, colIdx: number, mat: Matrix<T>) => void): void => {
	mat.forEach((row, rowIdx) => {
		return row.forEach((cell, colIdx) => {
			fn(cell, rowIdx, colIdx, mat);
		})
	});
}