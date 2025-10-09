	const inp = document.getElementById('in');
	const out = document.getElementById('out');
	document.getElementById('enc').addEventListener('click', () => {
		try {
			out.textContent = btoa(unescape(encodeURIComponent(inp.value)));
		} catch (e) {
			out.textContent = 'Error: ' + e
		}
	});
	document.getElementById('dec').addEventListener('click', () => {
		try {
			out.textContent = decodeURIComponent(escape(atob(inp.value)));
		} catch (e) {
			out.textContent = 'Error: ' + e
		}
	});
	document.getElementById('clear').addEventListener('click', () => {
		inp.value = '';
		out.textContent = '';
	});
	document.getElementById('copy').addEventListener('click', async () => {
		await navigator.clipboard.writeText(out.textContent);
		alert('Copied');
	});
	document.getElementById('download').addEventListener('click', () => {
		const blob = new Blob([out.textContent], {
			type: 'text/plain'
		});
		const url = URL.createObjectURL(blob);
		const a = document.createElement('a');
		a.href = url;
		a.download = 'output.txt';
		document.body.appendChild(a);
		a.click();
		a.remove();
		URL.revokeObjectURL(url);
	});