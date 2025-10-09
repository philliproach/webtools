		function makeSafeFilename() {
			let val = document.getElementById('filenameInput').value;
			val = val.normalize('NFKD').replace(/\p{Diacritic}/gu, '').replace(/[^a-zA-Z0-9._-]/g, '_');
			document.getElementById('filenameResult').textContent = val;
		}