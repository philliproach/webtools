		let clipHistory = [];

		function copyToClipboard() {
			const val = document.getElementById('clipInput').value;
			navigator.clipboard.writeText(val);
			clipHistory.unshift(val);
			updateHistory();
		}

		function pasteFromClipboard() {
			navigator.clipboard.readText().then(text => {
				document.getElementById('clipInput').value = text;
				clipHistory.unshift(text);
				updateHistory();
			});
		}

		function updateHistory() {
			document.getElementById('history').innerHTML = '<b>History:</b><br>' + clipHistory.slice(0, 5).map(h => `<div style='border-bottom:1px solid #eee;'>${h}</div>`).join('');
		}