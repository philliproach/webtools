	function b64uDecode(s) {
		s = s.replace(/-/g, '+').replace(/_/g, '/');
		while(s.length % 4) s += '=';
		try {
			return atob(s);
		} catch (e) {
			return null;
		}
	}
	document.getElementById('dec').addEventListener('click', () => {
		const token = document.getElementById('jwt').value.trim();
		if(!token) {
			alert('Paste a JWT');
			return;
		}
		const parts = token.split('.');
		if(parts.length < 2) {
			document.getElementById('out').textContent = 'Invalid JWT';
			return;
		}
		const head = b64uDecode(parts[0]);
		const payload = b64uDecode(parts[1]);
		let out = 'Header:\n' + (head ? JSON.stringify(JSON.parse(head), null, 2) : head) + '\n\nPayload:\n' + (payload ? JSON.stringify(JSON.parse(payload), null, 2) : payload);
		document.getElementById('out').textContent = out;
	});
	