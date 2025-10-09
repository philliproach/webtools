		function parseUrl() {
			try {
				const url = new URL(document.getElementById('urlInput').value);
				let html = `<b>Protocol:</b> ${url.protocol}<br>`;
				html += `<b>Host:</b> ${url.host}<br>`;
				html += `<b>Path:</b> ${url.pathname}<br>`;
				html += `<b>Query:</b> ${url.search}<br>`;
				html += `<b>Hash:</b> ${url.hash}<br>`;
				if(url.searchParams && url.searchParams.toString()) {
					html += `<b>Params:</b><br>`;
					url.searchParams.forEach((v, k) => {
						html += `${k}: ${v}<br>`;
					});
				}
				document.getElementById('urlResult').innerHTML = html;
			} catch (e) {
				document.getElementById('urlResult').textContent = 'Invalid URL';
			}
		}
		