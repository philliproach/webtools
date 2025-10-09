	function uuidv4() {
		const arr = new Uint8Array(16);
		crypto.getRandomValues(arr);
		arr[6] = (arr[6] & 0x0f) | 0x40;
		arr[8] = (arr[8] & 0x3f) | 0x80;
		const hex = [...arr].map(b => b.toString(16).padStart(2, '0')).join('');
		return `${hex.substr(0, 8)}-${hex.substr(8, 4)}-${hex.substr(12, 4)}-${hex.substr(16, 4)}-${hex.substr(20, 12)}`;
	}
	document.getElementById('gen').addEventListener('click', () => {
		const u = uuidv4();
		document.getElementById('out').textContent = u;
	});
	document.getElementById('copy').addEventListener('click', async () => {
		const t = document.getElementById('out').textContent;
		if(t) {
			await navigator.clipboard.writeText(t);
			alert('Copied');
		}
	});
	document.getElementById('clear').addEventListener('click', () => {
		document.getElementById('out').textContent = '';
	});
	