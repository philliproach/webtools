	const c = document.getElementById('c');
	const ctx = c.getContext('2d');
	let drawing = false;
	let lastX = 0,
		lastY = 0;

	function toLocal(e) {
		const rect = c.getBoundingClientRect();
		return {
			x: (e.clientX - rect.left) * (c.width / rect.width),
			y: (e.clientY - rect.top) * (c.height / rect.height)
		}
	}
	c.addEventListener('pointerdown', e => {
		drawing = true;
		const p = toLocal(e);
		lastX = p.x;
		lastY = p.y;
	});
	c.addEventListener('pointermove', e => {
		if(!drawing) return;
		const p = toLocal(e);
		ctx.strokeStyle = document.getElementById('color').value;
		ctx.lineWidth = document.getElementById('size').value;
		ctx.lineCap = 'round';
		ctx.beginPath();
		ctx.moveTo(lastX, lastY);
		ctx.lineTo(p.x, p.y);
		ctx.stroke();
		lastX = p.x;
		lastY = p.y;
		document.getElementById('save').style.display = 'inline-flex';
	});
	['pointerup', 'pointerleave'].forEach(ev => c.addEventListener(ev, () => drawing = false));
	document.getElementById('clear').addEventListener('click', () => {
		ctx.clearRect(0, 0, c.width, c.height);
		document.getElementById('save').style.display = 'none';
	});
	document.getElementById('save').addEventListener('click', () => {
		const url = c.toDataURL('image/png');
		document.getElementById('save').href = url;
		document.getElementById('save').download = 'sketch.png';
	});
	