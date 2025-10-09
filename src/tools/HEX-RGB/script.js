	function hexToRgb() {
		var hex = document.getElementById('hexInput').value.replace('#', '');
		if(hex.length !== 6) {
			document.getElementById('rgbResult').textContent = 'Invalid HEX.';
			return;
		}
		var r = parseInt(hex.substring(0, 2), 16);
		var g = parseInt(hex.substring(2, 4), 16);
		var b = parseInt(hex.substring(4, 6), 16);
		document.getElementById('rgbResult').textContent = 'RGB: ' + r + ', ' + g + ', ' + b;
	}

	function rgbToHex() {
		var rgb = document.getElementById('rgbInput').value.split(',');
		if(rgb.length !== 3) {
			document.getElementById('hexResult').textContent = 'Invalid RGB.';
			return;
		}
		var r = parseInt(rgb[0]);
		var g = parseInt(rgb[1]);
		var b = parseInt(rgb[2]);
		if(isNaN(r) || isNaN(g) || isNaN(b)) {
			document.getElementById('hexResult').textContent = 'Invalid RGB.';
			return;
		}
		var hex = '#' + [r, g, b].map(x => x.toString(16).padStart(2, '0')).join('');
		document.getElementById('hexResult').textContent = 'HEX: ' + hex;
	}
    	function hexToRgb(hex) {
		hex = hex.replace('#', '');
		if(hex.length === 3) hex = hex.split('').map(h => h + h).join('');
		const bigint = parseInt(hex, 16);
		return `${(bigint >> 16) & 255}, ${(bigint >> 8) & 255}, ${bigint & 255}`;
	}

	function rgbToHex(r, g, b) {
		return '#' + [r, g, b].map(n => Number(n).toString(16).padStart(2, '0')).join('');
	}
	document.getElementById('toRgb').addEventListener('click', () => {
		try {
			document.getElementById('out').textContent = hexToRgb(document.getElementById('hex').value || '');
		} catch (e) {
			document.getElementById('out').textContent = 'Invalid HEX';
		}
	});
	document.getElementById('toHex').addEventListener('click', () => {
		const r = document.getElementById('r').value;
		const g = document.getElementById('g').value;
		const b = document.getElementById('b').value;
		document.getElementById('out').textContent = rgbToHex(r, g, b);
	});