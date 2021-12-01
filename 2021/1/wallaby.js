module.exports = function (w) {

	return {
	  files: [
		'solution/*.ts',
		'input.txt',
		{pattern: 'tests/**', instrument: false},
		'runtime/**/*.ts',
		'package.json',
		{ pattern: 'solution/solve.ts', ignore: true } 
	  ],
  
	  tests: [
		'solution/solve.ts'
	  ],
	  env: {
		type: 'node'
	  }
	};
  };