		document.getElementById('fileInput').addEventListener('change', function(e) {
			const file = e.target.files[0];
			if(!file) return;
			const reader = new FileReader();
			reader.onload = function(ev) {
				document.getElementById('dataResult').textContent = ev.target.result;
			};
			reader.readAsDataURL(file);
		});

		function generateDataURI() {
			const text = document.getElementById('dataInput').value;
			const uri = 'data:text/plain;base64,' + btoa(unescape(encodeURIComponent(text)));
			document.getElementById('dataResult').textContent = uri;
		}
		