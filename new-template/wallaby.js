module.exports = function (w) {

	return {
	  files: [
		'solution/*.ts',
		'input.txt',
		{pattern: 'part1-tests/**', instrument: false},
		{pattern: 'part2-tests/**', instrument: false},
		'lib/*.ts',
		'package.json',
		{ pattern: 'solution/solve*.ts', ignore: true } 
	  ],
  
	  tests: [
		'solution/solve1.ts',
		'solution/solve2.ts'
	  ],
	  env: {
		type: 'node'
	  }
	};
  };