module.exports = function (w) {

	return {
	  files: [
		'puzzle-input.ts',
		'input.txt'
	  ],
  
	  tests: [
		'solve.ts'
	  ],
	  env: {
		type: 'node'
	  }
	};
  };