	const ta = document.getElementById('md-input');
	const pr = document.getElementById('md-preview');

	function render() {
		pr.innerHTML = marked.parse(ta.value || 'Type some **Markdown** on the left...');
	}
	ta.addEventListener('input', render);
	document.getElementById('clear-md').addEventListener('click', () => {
		ta.value = '';
		render();
		ta.focus();
	});
	document.getElementById('copy-md').addEventListener('click', async () => {
		await navigator.clipboard.writeText(ta.value);
		alert('Copied to clipboard');
	});
	document.getElementById('download-md').addEventListener('click', () => {
		const blob = new Blob([ta.value], {
			type: 'text/markdown'
		});
		const url = URL.createObjectURL(blob);
		const a = document.createElement('a');
		a.href = url;
		a.download = 'webtools.md';
		document.body.appendChild(a);
		a.click();
		a.remove();
		URL.revokeObjectURL(url);
	});
	render();
	