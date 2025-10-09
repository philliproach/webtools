	const lorem = `Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed non risus. Suspendisse lectus tortor, dignissim sit amet, adipiscing nec, ultricies sed, dolor.`;
	document.getElementById('gen').addEventListener('click', () => {
		const n = Math.max(1, Math.min(20, parseInt(document.getElementById('count').value || 3)));
		const parts = [];
		for(let i = 0; i < n; i++) parts.push(lorem);
		document.getElementById('out').innerHTML = parts.map(p => `<p>${p}</p>`).join('');
	});
	document.getElementById('copy').addEventListener('click', async () => {
		await navigator.clipboard.writeText(document.getElementById('out').innerText);
		alert('Copied');
	});
	