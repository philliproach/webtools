	document.getElementById('count').addEventListener('click', () => {
		const txt = document.getElementById('in').value || '';
		const chars = txt.length;
		const words = (txt.trim().match(/\S+/g) || []).length;
		const lines = txt.split(/\r?\n/).length;
		const mins = Math.ceil(words / 200);
		document.getElementById('out').innerHTML = `Words: <strong>${words}</strong> — Characters: <strong>${chars}</strong> — Lines: <strong>${lines}</strong> — Est. read: <strong>${mins} min</strong>`;
	});
	document.getElementById('clear').addEventListener('click', () => {
		document.getElementById('in').value = '';
		document.getElementById('out').textContent = '';
	});
	