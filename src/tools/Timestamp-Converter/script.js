	document.getElementById('toDate').addEventListener('click', () => {
		const v = document.getElementById('ts').value.trim();
		if(!v) return;
		let n = Number(v);
		if(String(v).length === 10) n = n * 1000;
		const d = new Date(n);
		document.getElementById('out').textContent = d.toString();
	});
	document.getElementById('now').addEventListener('click', () => {
		const n = Date.now();
		document.getElementById('out').textContent = `ms: ${n}\ns: ${Math.floor(n / 1000)}`;
	});
	document.getElementById('toTs').addEventListener('click', () => {
		const v = document.getElementById('dateIn').value;
		if(!v) return;
		const t = new Date(v).getTime();
		document.getElementById('out').textContent = `ms: ${t}\ns: ${Math.floor(t / 1000)}`;
	});
	