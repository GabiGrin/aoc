module.exports = function (w) {

	return {
	  files: [
		'*.ts',
		'input.txt',
		{ pattern: 'solve.ts', ignore: true } 
	  ],
  
	  tests: [
		'solve.ts'
	  ],
	  env: {
		type: 'node'
	  }
	};
  };