module.exports = function (w) {

	return {
	  files: [
		'puzzle-input.ts',
		'input.txt'
	  ],
  
	  tests: [
		'pt1.ts',
		'pt2.ts'
	  ],
	  env: {
		type: 'node'
	  }
	};
  };