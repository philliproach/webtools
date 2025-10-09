	function convertToAscii() {
		const file = document.getElementById('imgInput').files[0];
		if(!file) return;
		const reader = new FileReader();
		reader.onload = function(e) {
			const img = new Image();
			img.onload = function() {
				const canvas = document.createElement('canvas');
				const w = 80,
					h = Math.round(img.height * (80 / img.width));
				canvas.width = w;
				canvas.height = h;
				const ctx = canvas.getContext('2d');
				ctx.drawImage(img, 0, 0, w, h);
				const data = ctx.getImageData(0, 0, w, h).data;
				const chars = '@%#*+=-:. ';
				let ascii = '';
				for(let y = 0; y < h; y++) {
					for(let x = 0; x < w; x++) {
						const i = (y * w + x) * 4;
						const avg = (data[i] + data[i + 1] + data[i + 2]) / 3;
						ascii += chars[Math.floor(avg / 256 * (chars.length - 1))];
					}
					ascii += '\n';
				}
				document.getElementById('asciiResult').textContent = ascii;
			};
			img.src = e.target.result;
		};
		reader.readAsDataURL(file);
	}
	