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
	async function genMeme() {
		const f = document.getElementById('file').files[0];
		if(!f) {
			alert('Select an image');
			return;
		}
		const img = await loadImage(f);
		const w = Math.min(1200, img.width);
		const h = Math.round(img.height * (w / img.width));
		const c = document.createElement('canvas');
		c.width = w;
		c.height = h;
		const ctx = c.getContext('2d');
		ctx.drawImage(img, 0, 0, w, h);
		ctx.font = `${Math.floor(w / 12)}px Impact`;
		ctx.fillStyle = 'white';
		ctx.strokeStyle = 'black';
		ctx.lineWidth = Math.floor(w / 200);
		ctx.textAlign = 'center';
		const top = (document.getElementById('top').value || '').toUpperCase();
		const bottom = (document.getElementById('bottom').value || '').toUpperCase();
		ctx.fillText(top, w / 2, Math.floor(w / 12));
		ctx.strokeText(top, w / 2, Math.floor(w / 12));
		ctx.fillText(bottom, w / 2, h - Math.floor(w / 24));
		ctx.strokeText(bottom, w / 2, h - Math.floor(w / 24));
		const url = c.toDataURL('image/png');
		document.getElementById('preview').innerHTML = `<img src='${url}' style='max-width:100%;height:auto;border-radius:8px'>`;
		const a = document.getElementById('dl');
		a.href = url;
		a.download = 'meme.png';
		a.style.display = 'inline-flex';
	}
	document.getElementById('gen').addEventListener('click', genMeme);
	