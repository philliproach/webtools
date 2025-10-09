	function loadImage(file) {
		return new Promise((res, rej) => {
			const fr = new FileReader();
			fr.onload = () => {
				const img = new Image();
				img.onload = () => res(img);
				img.onerror = rej;
				img.src = fr.result;
			};
			fr.readAsDataURL(file);
		});
	}
	document.getElementById('compress').addEventListener('click', async () => {
		const f = document.getElementById('file').files[0];
		if(!f) {
			alert('Select an image');
			return;
		}
		const img = await loadImage(f);
		const maxw = Math.max(1, parseInt(document.getElementById('width').value) || 1024);
		const q = Math.max(0.1, Math.min(1, parseFloat(document.getElementById('quality').value) || 0.8));
		const scale = Math.min(1, maxw / img.width);
		const w = Math.round(img.width * scale);
		const h = Math.round(img.height * scale);
		const c = document.createElement('canvas');
		c.width = w;
		c.height = h;
		const ctx = c.getContext('2d');
		ctx.drawImage(img, 0, 0, w, h);
		c.toBlob(blob => {
			const url = URL.createObjectURL(blob);
			const a = document.getElementById('download');
			a.href = url;
			a.download = f.name.replace(/\.[^/.]+$/, '') + '-compressed.jpg';
			a.style.display = 'inline-flex';
			document.getElementById('info').textContent = `Original: ${Math.round(f.size / 1024)}KB -> ${Math.round(blob.size / 1024)}KB`;
		}, 'image/jpeg', q);
	});
	