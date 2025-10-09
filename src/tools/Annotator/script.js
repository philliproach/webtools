	let mode = 'draw';
	const c = document.getElementById('c');
	const ctx = c.getContext('2d');
	let drawing = false;
	let startX = 0,
		startY = 0;
	document.getElementById('drawBtn').addEventListener('click', () => mode = 'draw');
	document.getElementById('textBtn').addEventListener('click', () => mode = 'text');
	document.getElementById('rectBtn').addEventListener('click', () => mode = 'rect');
	document.getElementById('file').addEventListener('change', async (e) => {
		const f = e.target.files[0];
		if(!f) return;
		const img = await new Promise((res, rej) => {
			const fr = new FileReader();
			fr.onload = () => {
				const i = new Image();
				i.onload = () => res(i);
				i.src = fr.result;
			};
			fr.readAsDataURL(f);
		});
		c.width = img.width;
		c.height = img.height;
		ctx.drawImage(img, 0, 0);
		document.getElementById('save').style.display = 'inline-flex';
		document.getElementById('save').href = c.toDataURL('image/png');
		document.getElementById('save').download = f.name.replace(/\.[^/.]+$/, '') + '-annotated.png';
	});

	function toLocal(e) {
		const rect = c.getBoundingClientRect();
		return {
			x: (e.clientX - rect.left) * (c.width / rect.width),
			y: (e.clientY - rect.top) * (c.height / rect.height)
		}
	}
	c.addEventListener('pointerdown', (e) => {
		const p = toLocal(e);
		drawing = true;
		startX = p.x;
		startY = p.y;
		if(mode === 'text') {
			const txt = prompt('Text:');
			if(txt) {
				ctx.font = '28px sans-serif';
				ctx.fillStyle = 'yellow';
				ctx.fillText(txt, p.x, p.y);
			}
			drawing = false;
		}
	});
	c.addEventListener('pointermove', (e) => {
		if(!drawing) return;
		const p = toLocal(e);
		if(mode === 'draw') {
			ctx.strokeStyle = 'red';
			ctx.lineWidth = 4;
			ctx.lineCap = 'round';
			ctx.beginPath();
			ctx.moveTo(startX, startY);
			ctx.lineTo(p.x, p.y);
			ctx.stroke();
			startX = p.x;
			startY = p.y;
		}
	});
	c.addEventListener('pointerup', (e) => {
		if(!drawing) return;
		drawing = false;
		if(mode === 'rect') {
			const p = toLocal(e);
			ctx.strokeStyle = 'yellow';
			ctx.lineWidth = 6;
			ctx.strokeRect(startX, startY, p.x - startX, p.y - startY);
		}
		document.getElementById('save').href = c.toDataURL('image/png');
	});