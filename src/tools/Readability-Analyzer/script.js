	function countSyllables(word) {
		word = word.toLowerCase();
		if(word.length <= 3) return 1;
		word = word.replace(/(?:[^laeiouy]es|ed|[^laeiouy]e)$/, '');
		word = word.replace(/^y/, '');
		const matches = word.match(/[aeiouy]{1,2}/g);
		return matches ? matches.length : 1;
	}

	function words(text) {
		return text.trim().split(/\s+/).filter(Boolean);
	}
	document.getElementById('run').addEventListener('click', () => {
		const t = document.getElementById('txt').value || '';
		const w = words(t);
		const wordCount = w.length;
		const sentenceCount = (t.match(/[.!?]+/g) || []).length || 1;
		const syllables = w.reduce((s, wd) => s + countSyllables(wd), 0);
		const flesch = 206.835 - 1.015 * (wordCount / sentenceCount) - 84.6 * (syllables / wordCount || 0);
		const grade = 0.39 * (wordCount / sentenceCount) + 11.8 * (syllables / wordCount || 0) - 15.59;
		const mins = Math.max(1, Math.round(wordCount / 200));
		document.getElementById('out').innerHTML = `<div>Words: ${wordCount}</div><div>Sentences: ${sentenceCount}</div><div>Syllables: ${syllables}</div><div>Flesch Reading Ease: ${flesch.toFixed(1)}</div><div>Grade Level (approx): ${grade.toFixed(1)}</div><div>Est. reading time: ${mins} min</div>`;
	});
	