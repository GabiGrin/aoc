export const processWord = (word, opts) => {
    const cnt = word.length;
				const prob = probs[cnt];
	
				const letters = word.split('') as Letter[];
	
				if (prob.length === 1) {
					const digit = prob[0];
					const segments = litParts[digit];
	
					for (let letter in opts) {
	
						// remove the impossible segments from each letter that does not appear
						if (!letters.includes(letter as Letter)) {
							opts[letter] = opts[letter].filter(s => !segments.includes(s))
							// console.log('removing', segments, 'from', letter, `digit (${digit})`);
						} else {
							opts[letter] = opts[letter].filter(s => segments.includes(s))
							// console.log('removing segments other than', segments, 'from', letter, `digit (${digit})`);
						}
					}
				} else {
					const remainingOptions = prob.filter((digitToCheck) => {
						const neededForDigit = litParts[digitToCheck];
						const possibleLitParts = letters.reduce((set, c) => {
							const actual = opts[c];
							// console.log(actual);
							actual.forEach(a => set.add(a));
							return set;
						}, new Set())


						if (c) {
							console.log('checking digit', digitToCheck, 'needs', neededForDigit, opts, letters);
						}
						
						return neededForDigit.every(c => possibleLitParts.has(c));						
					});
					if (remainingOptions.length < 3) {

						console.log(remainingOptions);
					}
					
				}
}