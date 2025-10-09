	function testRegex() {
		var pattern = document.getElementById('regexInput').value;
		var text = document.getElementById('testText').value;
		var resultDiv = document.getElementById('regexResult');
		try {
			var regex = new RegExp(pattern, 'g');
			var matches = text.match(regex);
			resultDiv.textContent = matches ? 'Matches: ' + matches.join(', ') : 'No matches found.';
		} catch (e) {
			resultDiv.textContent = 'Invalid regex.';
		}
	}
	