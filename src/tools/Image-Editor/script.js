	(function() {
		const fileInput = document.getElementById('fileInput');
		const canvas = document.getElementById('canvas');
		const overlay = document.getElementById('overlay');
		const ctx = canvas.getContext('2d');
		const ox = overlay.getContext('2d');
		const modeEl = document.getElementById('mode');
		const colorEl = document.getElementById('color');
		const brushEl = document.getElementById('brush');
		const cropBtn = document.getElementById('cropBtn');
		const borderW = document.getElementById('borderW');
		const borderColor = document.getElementById('borderColor');
		const applyBorder = document.getElementById('applyBorder');
		const radiusEl = document.getElementById('radius');
		const undoBtn = document.getElementById('undoBtn');
		const redoBtn = document.getElementById('redoBtn');
		const downloadBtn = document.getElementById('downloadBtn');
		let image = new Image();
		let scale = 1;
		let isDrawing = false;
		let lastX = 0,
			lastY = 0;
		let drawMode = 'pan';
		let selection = null;
		let selecting = false;
		const history = {
			stack: [],
			pos: -1,
			max: 30
		};

		function pushHistory() {
			try {
				const data = canvas.toDataURL();
				if(history.pos < history.stack.length - 1) history.stack = history.stack.slice(0, history.pos + 1);
				history.stack.push(data);
				if(history.stack.length > history.max) history.stack.shift();
				history.pos = history.stack.length - 1;
			} catch (e) {}
		}

		function undo() {
			if(history.pos > 0) {
				history.pos--;
				const img = new Image();
				img.onload = () => {
					canvas.width = img.width;
					canvas.height = img.height;
					overlay.width = img.width;
					overlay.height = img.height;
					ctx.drawImage(img, 0, 0);
				};
				img.src = history.stack[history.pos];
			}
		}

		function redo() {
			if(history.pos < history.stack.length - 1) {
				history.pos++;
				const img = new Image();
				img.onload = () => {
					canvas.width = img.width;
					canvas.height = img.height;
					overlay.width = img.width;
					overlay.height = img.height;
					ctx.drawImage(img, 0, 0);
				};
				img.src = history.stack[history.pos];
			}
		}

		function fitCanvas(w, h) {
			const maxW = Math.min(w, 1200);
			const ratio = maxW / w;
			const logicalW = Math.round(w * ratio);
			const logicalH = Math.round(h * ratio);
			canvas.width = logicalW;
			canvas.height = logicalH;
			canvas.style.width = logicalW + 'px';
			canvas.style.height = logicalH + 'px';
			overlay.width = logicalW;
			overlay.height = logicalH;
			overlay.style.width = logicalW + 'px';
			overlay.style.height = logicalH + 'px';
			scale = ratio;
		}
		fileInput.addEventListener('change', (e) => {
			const f = e.target.files && e.target.files[0];
			if(!f) return;
			const reader = new FileReader();
			reader.onload = (ev) => {
				image = new Image();
				image.onload = () => {
					fitCanvas(image.naturalWidth, image.naturalHeight);
					canvas.style.width = canvas.width + 'px';
					canvas.style.height = canvas.height + 'px';
					overlay.style.left = '8px';
					overlay.style.top = '8px';
					ctx.clearRect(0, 0, canvas.width, canvas.height);
					ctx.drawImage(image, 0, 0, canvas.width, canvas.height);
					syncOverlay();
					pushHistory();
				};
				image.src = ev.target.result;
			};
			reader.readAsDataURL(f);
		});

		function getPointer(e) {
			const r = canvas.getBoundingClientRect();
			const x = (e.clientX - r.left);
			const y = (e.clientY - r.top);
			return {
				x: x,
				y: y
			};
		}
		canvas.addEventListener('pointerdown', (e) => {
			const p = getPointer(e);
			lastX = p.x;
			lastY = p.y;
			if(modeEl.value === 'draw' || modeEl.value === 'erase') {
				isDrawing = true;
				canvas.setPointerCapture(e.pointerId);
				ctx.lineJoin = 'round';
				ctx.lineCap = 'round';
				ctx.lineWidth = parseInt(brushEl.value, 10) || 8;
				if(modeEl.value === 'erase') {
					ctx.globalCompositeOperation = 'destination-out';
					ctx.strokeStyle = 'rgba(0,0,0,1)';
				} else {
					ctx.globalCompositeOperation = 'source-over';
					ctx.strokeStyle = colorEl.value;
				}
				ctx.beginPath();
				ctx.moveTo(lastX, lastY);
			} else if(modeEl.value === 'select') {
				selecting = true;
				selection = {
					x: p.x,
					y: p.y,
					w: 0,
					h: 0,
					startX: p.x,
					startY: p.y
				};
				drawOverlay();
			}
		});
		canvas.addEventListener('pointermove', (e) => {
			const p = getPointer(e);
			if(isDrawing) {
				ctx.lineTo(p.x, p.y);
				ctx.stroke();
				lastX = p.x;
				lastY = p.y;
			}
			if(selecting && selection) {
				selection.w = p.x - selection.startX;
				selection.h = p.y - selection.startY;
				drawOverlay();
			}
		});
		canvas.addEventListener('pointerup', (e) => {
			if(isDrawing) {
				isDrawing = false;
				ctx.closePath();
				ctx.globalCompositeOperation = 'source-over';
				pushHistory();
			}
			if(selecting) {
				selecting = false;
				drawOverlay();
			}
		});

		function drawOverlay() {
			ox.clearRect(0, 0, overlay.width, overlay.height);
			if(selection) {
				ox.strokeStyle = 'rgba(255,255,255,0.9)';
				ox.lineWidth = 2;
				ox.setLineDash([6, 4]);
				ox.strokeRect(selection.x, selection.y, selection.w, selection.h);
			}
		}
		cropBtn.addEventListener('click', () => {
			if(!selection) return alert('Draw a selection first using Select/Crop');
			const sx = Math.min(selection.x, selection.x + selection.w);
			const sy = Math.min(selection.y, selection.y + selection.h);
			const sw = Math.abs(selection.w);
			const sh = Math.abs(selection.h);
			if(sw < 4 || sh < 4) return alert('Selection too small');
			const tmp = document.createElement('canvas');
			tmp.width = sw;
			tmp.height = sh;
			const tctx = tmp.getContext('2d');
			tctx.drawImage(canvas, sx, sy, sw, sh, 0, 0, sw, sh);
			canvas.width = sw;
			canvas.height = sh;
			overlay.width = sw;
			overlay.height = sh;
			ctx.clearRect(0, 0, sw, sh);
			ctx.drawImage(tmp, 0, 0);
			selection = null;
			drawOverlay();
			pushHistory();
		});
		applyBorder.addEventListener('click', () => {
			const bw = parseInt(borderW.value, 10) || 0;
			const bc = borderColor.value;
			if(bw <= 0) return alert('Set border width greater than 0');
			ctx.save();
			ctx.strokeStyle = bc;
			ctx.lineWidth = bw * 2;
			const r = parseInt(radiusEl.value, 10) || 0;
			if(r > 0) {
				roundRect(ctx, bw, bw, canvas.width - bw * 2, canvas.height - bw * 2, r);
				ctx.stroke();
			} else {
				ctx.strokeRect(bw, bw, canvas.width - bw * 2, canvas.height - bw * 2);
			}
			ctx.restore();
			pushHistory();
		});

		function roundRect(ctx, x, y, w, h, r) {
			ctx.beginPath();
			ctx.moveTo(x + r, y);
			ctx.arcTo(x + w, y, x + w, y + h, r);
			ctx.arcTo(x + w, y + h, x, y + h, r);
			ctx.arcTo(x, y + h, x, y, r);
			ctx.arcTo(x, y, x + w, y, r);
			ctx.closePath();
		}
		undoBtn.addEventListener('click', undo);
		redoBtn.addEventListener('click', redo);
		downloadBtn.addEventListener('click', () => {
			const exp = document.createElement('canvas');
			exp.width = canvas.width;
			exp.height = canvas.height;
			const ectx = exp.getContext('2d');
			const r = parseInt(radiusEl.value, 10) || 0;
			if(r > 0) {
				ectx.save();
				roundRect(ectx, 0, 0, exp.width, exp.height, r);
				ectx.clip();
			}
			ectx.drawImage(canvas, 0, 0);
			if(parseInt(borderW.value, 10) > 0) {
				ectx.save();
				ectx.strokeStyle = borderColor.value;
				ectx.lineWidth = parseInt(borderW.value, 10);
				if(r > 0) {
					roundRect(ectx, ectx.lineWidth / 2, ectx.lineWidth / 2, exp.width - ectx.lineWidth, exp.height - ectx.lineWidth, r);
					ectx.stroke();
				} else {
					ectx.strokeRect(ectx.lineWidth / 2, ectx.lineWidth / 2, exp.width - ectx.lineWidth, exp.height - ectx.lineWidth);
				}
				ectx.restore();
			}
			const url = exp.toDataURL('image/png');
			const a = document.createElement('a');
			a.href = url;
			a.download = 'image-edit.png';
			document.body.appendChild(a);
			a.click();
			a.remove();
		});

		function syncOverlay() {
			const r = canvas.getBoundingClientRect();
			overlay.style.width = canvas.width + 'px';
			overlay.style.height = canvas.height + 'px';
			overlay.width = canvas.width;
			overlay.height = canvas.height;
		}
		window.addEventListener('resize', syncOverlay);
		canvas.width = 800;
		canvas.height = 500;
		overlay.width = canvas.width;
		overlay.height = canvas.height;
		ctx.fillStyle = '#ffffff';
		ctx.fillRect(0, 0, canvas.width, canvas.height);
		pushHistory();
	})();