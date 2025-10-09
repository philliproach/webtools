	document.getElementById('htmlInput').addEventListener('input', function() {
		const html = `<body style='background:#fff;margin:0;color:#222;'>${this.value}</body>`;
		document.getElementById('htmlPreview').srcdoc = html;
	});
	