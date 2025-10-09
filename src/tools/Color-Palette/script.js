    function getImageData(file) {
		return new Promise((res, rej) => {
			const fr = new FileReader();
			fr.onload = () => {
				const img = new Image();
				img.onload = () => {
					const w = 80;
					const h = Math.round(img.height * (w / img.width));
					const c = document.createElement('canvas');
					c.width = w;
					c.height = h;
					const ctx = c.getContext('2d');
					ctx.drawImage(img, 0, 0, w, h);
					res(ctx.getImageData(0, 0, w, h));
				};
				img.onerror = rej;
				img.src = fr.result;
			};
			fr.readAsDataURL(file);
		});
	}

	function rgbToHex(r, g, b) {
		return '#' + [r, g, b].map(x => x.toString(16).padStart(2, '0')).join('');
	}
	document.getElementById('extract').addEventListener('click', async () => {
		const f = document.getElementById('file').files[0];
		if(!f) {
			alert('Select an image');
			return;
		}
		const size = Math.max(2, Math.min(20, parseInt(document.getElementById('size').value) || 6));
		const imgData = await getImageData(f);
		const counts = new Map();
		for(let i = 0; i < imgData.data.length; i += 4) {
			const r = imgData.data[i],
				g = imgData.data[i + 1],
				b = imgData.data[i + 2];
			const key = Math.round(r / 16) + ',' + Math.round(g / 16) + ',' + Math.round(b / 16);
			counts.set(key, (counts.get(key) || 0) + 1);
		}
		const arr = Array.from(counts.entries()).sort((a, b) => b[1] - a[1]);
		const swatches = document.getElementById('swatches');
		swatches.innerHTML = '';
		for(let i = 0; i < size && i < arr.length; i++) {
			const [key] = arr[i];
			const [rr, gg, bb] = key.split(',').map(x => parseInt(x) * 16 + 8);
			const hex = rgbToHex(rr, gg, bb);
			const el = document.createElement('div');
			el.style.width = '72px';
			el.style.height = '72px';
			el.style.borderRadius = '8px';
			el.style.background = hex;
			el.style.display = 'flex';
			el.style.alignItems = 'flex-end';
			el.style.justifyContent = 'center';
			el.style.padding = '.35rem';
			el.style.boxShadow = '0 1px 3px rgba(0,0,0,.12)';
			const label = document.createElement('div');
			label.style.background = 'rgba(255,255,255,.8)';
			label.style.fontSize = '12px';
			label.style.padding = '2px 6px';
			label.style.borderRadius = '4px';
			label.textContent = hex;
			label.style.color = '#000';
			el.appendChild(label);
			swatches.appendChild(el);
		}
	});
	