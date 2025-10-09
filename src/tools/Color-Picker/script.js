    const color = document.getElementById('color');
	const hex = document.getElementById('hex');
	const rgb = document.getElementById('rgb');

	function update() {
		hex.value = color.value;
		const c = color.value;
		const r = parseInt(c.slice(1, 3), 16);
		const g = parseInt(c.slice(3, 5), 16);
		const b = parseInt(c.slice(5, 7), 16);
		rgb.textContent = `rgb(${r}, ${g}, ${b})`;
		rgb.style.background = c;
	}
	color.addEventListener('input', update);
	hex.addEventListener('change', () => {
		color.value = hex.value;
		update();
	});
	document.getElementById('copy-hex').addEventListener('click', async () => {
		await navigator.clipboard.writeText(hex.value);
		alert('Copied HEX');
	});
	update();
	