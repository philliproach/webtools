	const qEl = document.getElementById('qr');
	const q = new QRious({
		element: document.createElement('canvas'),
		size: 360
	});
	qEl.appendChild(q.element);
	document.getElementById('gen').addEventListener('click', () => {
		const v = document.getElementById('txt').value || window.location.href;
		q.set({
			value: v
		});
		const url = q.element.toDataURL('image/png');
		const a = document.getElementById('dl');
		a.href = url;
		a.download = 'qr.png';
		a.style.display = 'inline-flex';
	});
	document.getElementById('clear-qr').addEventListener('click', () => {
		q.set({
			value: ''
		});
		document.getElementById('txt').value = '';
		document.getElementById('dl').style.display = 'none';
	});
	document.getElementById('copy-qr').addEventListener('click', async () => {
		const data = q.element.toDataURL('image/png');
		const res = await fetch(data);
		const blob = await res.blob();
		await navigator.clipboard.write([new ClipboardItem({
			[blob.type]: blob
		})]);
		alert('Image copied to clipboard');
	});
	