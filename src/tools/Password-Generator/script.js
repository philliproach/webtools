	function randInt(n) {
		return Math.floor(Math.random() * n)
	}

	function gen(len, sets) {
		const all = sets.join('');
		let out = '';
		for(let i = 0; i < len; i++) out += all[randInt(all.length)];
		return out;
	}
	document.getElementById('gen').addEventListener('click', () => {
		const len = Math.max(4, Math.min(128, parseInt(document.getElementById('length').value || 16)));
		const sets = [];
		if(document.getElementById('upper').checked) sets.push('ABCDEFGHIJKLMNOPQRSTUVWXYZ');
		if(document.getElementById('lower').checked) sets.push('abcdefghijklmnopqrstuvwxyz');
		if(document.getElementById('numbers').checked) sets.push('0123456789');
		if(document.getElementById('symbols').checked) sets.push('!@#$%^&*()-_=+[]{}|;:,.<>?');
		if(sets.length === 0) {
			alert('Select at least one character set');
			return
		}
		const pw = gen(len, sets);
		document.getElementById('out').textContent = pw;
	});
	document.getElementById('copy').addEventListener('click', async () => {
		await navigator.clipboard.writeText(document.getElementById('out').textContent);
		alert('Copied');
	});
	