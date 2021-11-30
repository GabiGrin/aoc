module.exports = function (w) {

	return {
	  files: [
		'puzzle-input.ts',
		'input.txt',
		'utils.ts'
	  ],
  
	  tests: [
		'solve.ts'
	  ],
	  env: {
		type: 'node'
	  }
	};
  };