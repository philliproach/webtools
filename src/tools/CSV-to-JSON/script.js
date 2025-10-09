	function csvToJson(text) {
		const lines = text.trim().split(/\r?\n/).filter(Boolean);
		if(lines.length === 0) return [];
		const headers = lines.shift().split(/,|;|\t/).map(h => h.trim());
		return lines.map(l => {
			const parts = l.split(/,|;|\t/);
			const obj = {};
			headers.forEach((h, i) => obj[h] = parts[i] || '');
			return obj;
		});
	}
	const out = document.getElementById('out');
	document.getElementById('convert').addEventListener('click', () => {
		try {
			const j = csvToJson(document.getElementById('csv').value);
			out.textContent = JSON.stringify(j, null, 2);
		} catch (e) {
			out.textContent = 'Error: ' + e
		}
	});
	document.getElementById('file').addEventListener('change', async (e) => {
		const f = e.target.files[0];
		if(!f) return;
		const t = await f.text();
		document.getElementById('csv').value = t;
		document.getElementById('convert').click();
	});
	document.getElementById('clear-csv').addEventListener('click', () => {
		document.getElementById('csv').value = '';
		out.textContent = '';
	});
	document.getElementById('copy-json').addEventListener('click', async () => {
		await navigator.clipboard.writeText(out.textContent);
		alert('Copied JSON');
	});
	document.getElementById('download-json').addEventListener('click', () => {
		const blob = new Blob([out.textContent], {
			type: 'application/json'
		});
		const url = URL.createObjectURL(blob);
		const a = document.createElement('a');
		a.href = url;
		a.download = 'data.json';
		document.body.appendChild(a);
		a.click();
		a.remove();
		URL.revokeObjectURL(url);
	});
	