	document.getElementById('conv').addEventListener('click', () => {
		const v = document.getElementById('dt').value;
		const tz = document.getElementById('tz').value.trim();
		if(!v || !tz) {
			alert('Provide datetime and timezone');
			return;
		}
		const d = new Date(v);
		try {
			const str = d.toLocaleString('en-US', {
				timeZone: tz
			});
			document.getElementById('out').textContent = str + ' (' + tz + ')';
		} catch (e) {
			document.getElementById('out').textContent = 'Timezone not supported in this browser';
		}
	});
	