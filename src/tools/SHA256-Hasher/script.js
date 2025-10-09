	async function sha256(text) {
		const enc = new TextEncoder();
		const data = enc.encode(text);
		const hash = await crypto.subtle.digest('SHA-256', data);
		return Array.from(new Uint8Array(hash)).map(b => b.toString(16).padStart(2, '0')).join('');
	}
	document.getElementById('hash').addEventListener('click', async () => {
		const t = document.getElementById('in').value || '';
		const h = await sha256(t);
		document.getElementById('out').textContent = h;
	});
	document.getElementById('copy').addEventListener('click', async () => {
		const t = document.getElementById('out').textContent;
		if(t) await navigator.clipboard.writeText(t);
		alert('Copied');
	});
	