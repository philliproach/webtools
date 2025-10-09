	document.getElementById('enc').addEventListener('click', () => {
		document.getElementById('out').textContent = encodeURIComponent(document.getElementById('in').value || '');
	});
	document.getElementById('dec').addEventListener('click', () => {
		try {
			document.getElementById('out').textContent = decodeURIComponent(document.getElementById('in').value || '');
		} catch (e) {
			document.getElementById('out').textContent = 'Invalid input: ' + e;
		}
	});
	