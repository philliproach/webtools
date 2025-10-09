document.addEventListener('DOMContentLoaded', function() {
	const fileInput = document.getElementById('fileInput');
	const formatSelect = document.getElementById('formatSelect');
	const convertBtn = document.getElementById('convertBtn');
	const downloadLink = document.getElementById('downloadLink');
	const preview = document.getElementById('preview');
	const messages = document.getElementById('messages');
	const qualityWrap = document.getElementById('qualityWrap');
	const qualityEl = document.getElementById('quality');

	function showMessage(msg) {
		messages.textContent = msg;
	}
	const dropzone = document.getElementById('dropzone');
	const dzLabel = document.getElementById('dzLabel');
	const fileMeta = document.getElementById('fileMeta');

	function updateMeta(file) {
		if(!file) return fileMeta.textContent = '';
		fileMeta.textContent = `${file.name} \u2014 ${(file.size / 1024 | 0)} KB \u2014 ${file.type || 'unknown'}`;
	}
	['dragenter', 'dragover', 'dragleave', 'drop'].forEach(ev => {
		dropzone.addEventListener(ev, e => e.preventDefault());
	});
	dropzone.addEventListener('dragover', () => dropzone.classList.add('dragover'));
	dropzone.addEventListener('dragleave', () => dropzone.classList.remove('dragover'));
	dropzone.addEventListener('drop', (e) => {
		dropzone.classList.remove('dragover');
		const f = e.dataTransfer && e.dataTransfer.files && e.dataTransfer.files[0];
		if(f) {
			fileInput.files = e.dataTransfer.files;
			updateMeta(f);
			dzLabel.textContent = 'File ready \u2014 click Convert';
		}
	});
	dropzone.addEventListener('click', () => fileInput.click());
	dropzone.setAttribute('tabindex', '0');
	dropzone.addEventListener('keydown', (e) => {
		if(e.key === 'Enter' || e.key === ' ') {
			e.preventDefault();
			fileInput.click();
		}
	});
	fileInput.addEventListener('change', () => {
		const f = fileInput.files && fileInput.files[0];
		updateMeta(f);
		if(f) dzLabel.textContent = 'File ready \u2014 click Convert';
	});
	formatSelect.addEventListener('change', function() {
		const v = formatSelect.value;
		if(v === 'image/jpeg' || v === 'image/webp' || v === 'image/avif') {
			qualityWrap.style.display = '';
		} else {
			qualityWrap.style.display = 'none';
		}
	});
	async function convertFilesToBlobs(files, format, quality) {
		const results = [];
		for(let i = 0; i < files.length; i++) {
			const file = files[i];
			try {
				if(format === 'image/gif') {
					if(file.type === 'image/gif') {
						results.push({
							name: file.name.replace(/\.[^.]+$/, '') + '.gif',
							blob: file
						});
						continue;
					} else {
						throw new Error('Converting arbitrary images to GIF is not supported in-browser.');
					}
				}
				const img = await loadImageFromFile(file);
				if(format === 'application/pdf') {
					const pdfBlob = await encodePDF(img);
					results.push({
						name: file.name.replace(/\.[^.]+$/, '') + '.pdf',
						blob: pdfBlob
					});
					continue;
				}
				if(format === 'image/svg+xml') {
					const svgBlob = await encodeSVG(img);
					results.push({
						name: file.name.replace(/\.[^.]+$/, '') + '.svg',
						blob: svgBlob
					});
					continue;
				}
				if(format === 'image/bmp') {
					const bmpBlob = await encodeBMP(img);
					results.push({
						name: file.name.replace(/\.[^.]+$/, '') + '.bmp',
						blob: bmpBlob
					});
					continue;
				}
				if(format === 'image/x-icon') {
					const icoBlob = await encodeICO(img);
					results.push({
						name: file.name.replace(/\.[^.]+$/, '') + '.ico',
						blob: icoBlob
					});
					continue;
				}
				const blob = await convertImageToBlob(img, format, quality);
				const ext = mimeToExt(format);
				results.push({
					name: file.name.replace(/\.[^.]+$/, '') + '.' + ext,
					blob
				});
			} catch (err) {
				results.push({
					name: file.name,
					error: err
				});
			}
		}
		return results;
	}
	async function encodeSVG(img) {
		const canvas = document.createElement('canvas');
		canvas.width = img.naturalWidth || img.width;
		canvas.height = img.naturalHeight || img.height;
		const ctx = canvas.getContext('2d');
		ctx.drawImage(img, 0, 0, canvas.width, canvas.height);
		const dataUrl = canvas.toDataURL('image/png');
		const svg = `<?xml version="1.0" encoding="UTF-8"?>\n<svg xmlns="http://www.w3.org/2000/svg" width="${canvas.width}" height="${canvas.height}">\n  <image href="${dataUrl}" width="${canvas.width}" height="${canvas.height}"/>\n</svg>`;
		return new Blob([svg], {
			type: 'image/svg+xml'
		});
	}
	convertBtn.addEventListener('click', async function() {
		const files = fileInput.files && Array.from(fileInput.files);
		if(!files || files.length === 0) return showMessage('Please choose one or more image files first.');
		const format = formatSelect.value;
		const quality = parseFloat(qualityEl ? qualityEl.value : 0.9);
		preview.innerHTML = '';
		showMessage('Converting ' + files.length + ' file(s)...');
		const results = await convertFilesToBlobs(files, format, quality);
		const zip = new JSZip();
		const errors = [];
		for(let r of results) {
			if(r.error) {
				errors.push(r.name + ': ' + (r.error && r.error.message ? r.error.message : r.error));
			} else {
				zip.file(r.name, r.blob);
			}
		}
		if(errors.length) showMessage('Some files failed: ' + errors.join('; '));
		if(Object.keys(zip.files).length === 0) {
			return showMessage('No files to download.');
		}
		showMessage('Preparing ZIP...');
		const zipBlob = await zip.generateAsync({
			type: 'blob'
		});
		const zipUrl = URL.createObjectURL(zipBlob);
		const zipName = 'webtools-converted-' + Date.now() + '.zip';
		const first = results.find(r => r && !r.error);
		if(first) {
			const pUrl = URL.createObjectURL(first.blob);
			const pImg = document.createElement('img');
			pImg.src = pUrl;
			pImg.style.maxWidth = '320px';
			pImg.style.maxHeight = '320px';
			preview.appendChild(pImg);
			setTimeout(() => URL.revokeObjectURL(pUrl), 5000);
		}
		const a = document.createElement('a');
		a.href = zipUrl;
		a.download = zipName;
		document.body.appendChild(a);
		a.click();
		setTimeout(() => {
			URL.revokeObjectURL(zipUrl);
			a.remove();
			showMessage('Download started: ' + zipName);
		}, 1500);
	});

	function mimeToExt(mime) {
		if(mime === 'image/jpeg') return 'jpg';
		if(mime === 'image/png') return 'png';
		if(mime === 'image/webp') return 'webp';
		if(mime === 'image/avif') return 'avif';
		if(mime === 'image/bmp') return 'bmp';
		if(mime === 'image/x-icon') return 'ico';
		if(mime === 'application/pdf') return 'pdf';
		if(mime === 'image/gif') return 'gif';
		if(mime === 'image/svg+xml') return 'svg';
		return 'bin';
	}

	function encodeBMP(img) {
		return new Promise((resolve, reject) => {
			const canvas = document.createElement('canvas');
			canvas.width = img.naturalWidth || img.width;
			canvas.height = img.naturalHeight || img.height;
			const ctx = canvas.getContext('2d');
			ctx.drawImage(img, 0, 0, canvas.width, canvas.height);
			const w = canvas.width;
			const h = canvas.height;
			const rowSize = Math.floor((24 * w + 31) / 32) * 4;
			const pixelArraySize = rowSize * h;
			const headerSize = 14 + 40;
			const fileSize = headerSize + pixelArraySize;
			const buffer = new ArrayBuffer(fileSize);
			const view = new DataView(buffer);
			let offset = 0;
			view.setUint8(offset, 0x42);
			offset++;
			view.setUint8(offset, 0x4D);
			offset++;
			view.setUint32(offset, fileSize, true);
			offset += 4;
			view.setUint16(offset, 0, true);
			offset += 2;
			view.setUint16(offset, 0, true);
			offset += 2;
			view.setUint32(offset, headerSize, true);
			offset += 4;
			view.setUint32(offset, 40, true);
			offset += 4;
			view.setInt32(offset, w, true);
			offset += 4;
			view.setInt32(offset, h, true);
			offset += 4;
			view.setUint16(offset, 1, true);
			offset += 2;
			view.setUint16(offset, 24, true);
			offset += 2;
			view.setUint32(offset, 0, true);
			offset += 4;
			view.setUint32(offset, pixelArraySize, true);
			offset += 4;
			view.setInt32(offset, 0, true);
			offset += 4;
			view.setInt32(offset, 0, true);
			offset += 4;
			view.setUint32(offset, 0, true);
			offset += 4;
			view.setUint32(offset, 0, true);
			offset += 4;
			const imgData = ctx.getImageData(0, 0, w, h).data;
			let p = headerSize;
			const padding = rowSize - w * 3;
			for(let row = h - 1; row >= 0; row--) {
				for(let col = 0; col < w; col++) {
					const idx = (row * w + col) * 4;
					const r = imgData[idx];
					const g = imgData[idx + 1];
					const b = imgData[idx + 2];
					view.setUint8(p++, b);
					view.setUint8(p++, g);
					view.setUint8(p++, r);
				}
				for(let k = 0; k < padding; k++) view.setUint8(p++, 0);
			}
			resolve(new Blob([buffer], {
				type: 'image/bmp'
			}));
		});
	}
	async function encodeICO(img) {
		const size = 32;
		const canvas = document.createElement('canvas');
		canvas.width = size;
		canvas.height = size;
		const ctx = canvas.getContext('2d');
		ctx.clearRect(0, 0, size, size);
		const ratio = Math.min(size / img.naturalWidth, size / img.naturalHeight);
		const dw = img.naturalWidth * ratio;
		const dh = img.naturalHeight * ratio;
		const dx = (size - dw) / 2;
		const dy = (size - dh) / 2;
		ctx.drawImage(img, dx, dy, dw, dh);
		const pngBlob = await new Promise((res, rej) => {
			canvas.toBlob(b => b ? res(b) : rej(new Error('PNG generation failed')), 'image/png');
		});
		const pngArr = new Uint8Array(await pngBlob.arrayBuffer());
		const header = new ArrayBuffer(6);
		const hView = new DataView(header);
		hView.setUint16(0, 0, true);
		hView.setUint16(2, 1, true);
		hView.setUint16(4, 1, true);
		const dir = new ArrayBuffer(16);
		const dView = new DataView(dir);
		dView.setUint8(0, size);
		dView.setUint8(1, size);
		dView.setUint8(2, 0);
		dView.setUint8(3, 0);
		dView.setUint16(4, 1, true);
		dView.setUint16(6, 32, true);
		dView.setUint32(8, pngArr.length, true);
		dView.setUint32(12, 6 + 16, true);
		const out = new Uint8Array(header.byteLength + dir.byteLength + pngArr.length);
		out.set(new Uint8Array(header), 0);
		out.set(new Uint8Array(dir), header.byteLength);
		out.set(pngArr, header.byteLength + dir.byteLength);
		return new Blob([out], {
			type: 'image/x-icon'
		});
	}
	async function encodePDF(img) {
		const canvas = document.createElement('canvas');
		canvas.width = img.naturalWidth || img.width;
		canvas.height = img.naturalHeight || img.height;
		const ctx = canvas.getContext('2d');
		ctx.fillStyle = '#ffffff';
		ctx.fillRect(0, 0, canvas.width, canvas.height);
		ctx.drawImage(img, 0, 0, canvas.width, canvas.height);
		const dataUrl = canvas.toDataURL('image/png');
		if(!window.jspdf) throw new Error('jsPDF not loaded');
		const {
			jsPDF
		} = window.jspdf;
		const pdf = new jsPDF({
			unit: 'px',
			format: [canvas.width, canvas.height]
		});
		pdf.addImage(dataUrl, 'PNG', 0, 0, canvas.width, canvas.height);
		const blob = pdf.output('blob');
		return blob;
	}

	function loadImageFromFile(file) {
		return new Promise((resolve, reject) => {
			const reader = new FileReader();
			reader.onload = () => {
				const img = new Image();
				img.onload = () => resolve(img);
				img.onerror = reject;
				img.src = reader.result;
			};
			reader.onerror = reject;
			reader.readAsDataURL(file);
		});
	}

	function convertImageToBlob(img, mime, quality) {
		return new Promise((resolve, reject) => {
			const canvas = document.createElement('canvas');
			canvas.width = img.naturalWidth || img.width;
			canvas.height = img.naturalHeight || img.height;
			const ctx = canvas.getContext('2d');
			ctx.fillStyle = '#ffffff';
			ctx.fillRect(0, 0, canvas.width, canvas.height);
			ctx.drawImage(img, 0, 0, canvas.width, canvas.height);
			if(canvas.toBlob) {
				canvas.toBlob((b) => {
					if(b) resolve(b);
					else reject(new Error('toBlob returned null'));
				}, mime, mime === 'image/png' ? undefined : quality);
			} else {
				try {
					const data = canvas.toDataURL(mime, quality);
					const bin = atob(data.split(',')[1]);
					const arr = new Uint8Array(bin.length);
					for(let i = 0; i < bin.length; i++) arr[i] = bin.charCodeAt(i);
					resolve(new Blob([arr], {
						type: mime
					}));
				} catch (e) {
					reject(e);
				}
			}
		});
	}

	function parseFormatAlias(value) {
		if(!value) return null;
		const v = String(value).toLowerCase();
		if(v === 'png') return 'image/png';
		if(v === 'jpg' || v === 'jpeg') return 'image/jpeg';
		if(v === 'webp') return 'image/webp';
		if(v === 'avif') return 'image/avif';
		if(v === 'bmp') return 'image/bmp';
		if(v === 'ico' || v === 'icon') return 'image/x-icon';
		if(v === 'pdf') return 'application/pdf';
		if(v === 'gif') return 'image/gif';
		if(v === 'svg') return 'image/svg+xml';
		return null;
	}

	function applyQueryFormat() {
		try {
			const params = new URLSearchParams(window.location.search);
			const keys = ['to', 'format', 'output', 'type'];
			for(const k of keys) {
				if(params.has(k)) {
					const candidate = parseFormatAlias(params.get(k));
					if(candidate) {
						formatSelect.value = candidate;
						formatSelect.dispatchEvent(new Event('change'));
						return;
					}
				}
			}
			const path = window.location.pathname.toLowerCase();
			const known = ['png', 'jpg', 'jpeg', 'webp', 'avif', 'bmp', 'ico', 'pdf', 'gif', 'svg'];
			for(const k of known) {
				if(path.includes(k + '-to-') || path.includes('-to-' + k) || path.includes(k + '2')) {
					const candidate = parseFormatAlias(k);
					if(candidate) {
						formatSelect.value = candidate;
						formatSelect.dispatchEvent(new Event('change'));
						return;
					}
				}
			}
			const ref = document.referrer || '';
			if(ref.includes('google.') || ref.includes('bing.') || ref.includes('duckduckgo')) {
				try {
					const u = new URL(ref);
					const q = u.searchParams.get('q');
					if(q) {
						for(const k of ['svg', 'png', 'jpg', 'jpeg', 'webp', 'avif', 'bmp', 'ico', 'pdf', 'gif']) {
							if(q.toLowerCase().includes(k)) {
								const candidate = parseFormatAlias(k);
								if(candidate) {
									formatSelect.value = candidate;
									formatSelect.dispatchEvent(new Event('change'));
									return;
								}
							}
						}
					}
				} catch (e) {}
			}
		} catch (e) {}
	}
	applyQueryFormat();
});