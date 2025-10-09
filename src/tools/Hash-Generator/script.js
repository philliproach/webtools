	async function md5(str) {
		function toUtf8Bytes(s) {
			return new TextEncoder().encode(s);
		}
		const buf = toUtf8Bytes(str);
		if(window.crypto && crypto.subtle && ['SHA-1', 'SHA-256'].includes('MD5')) {}

		function rhex(n) {
			let s = '';
			for(let j = 0; j < 4; j++) s += ((n >> (j * 8)) & 0xFF).toString(16).padStart(2, '0');
			return s;
		}

		function md5cycle(x, k) {}
		return Promise.resolve('md5-not-implemented');
	}
	async function hash(alg, txt) {
		if(alg === 'MD5') {
			return 'md5 not implemented in this build';
		}
		const name = alg.replace('-', '');
		const data = new TextEncoder().encode(txt);
		const res = await crypto.subtle.digest(name, data);
		return Array.from(new Uint8Array(res)).map(b => b.toString(16).padStart(2, '0')).join('');
	}
	document.getElementById('run').addEventListener('click', async () => {
		const txt = document.getElementById('txt').value || '';
		const alg = document.getElementById('alg').value;
		const out = document.getElementById('out');
		try {
			const h = await hash(alg, txt);
			out.textContent = h;
		} catch (e) {
			out.textContent = 'Error: ' + e.message;
		}
	});
	