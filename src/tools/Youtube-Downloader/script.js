	const gen = document.getElementById('genYt');
	const copyBtn = document.getElementById('copyYt');
	gen.addEventListener('click', () => {
		const url = document.getElementById('ytUrl').value.trim();
		const fmt = document.getElementById('ytFormat').value;
		const out = document.getElementById('ytOut').value.trim() || '%(title)s.%(ext)s';
		if(!url) {
			alert('Paste a YouTube video URL');
			return;
		}
		let cmd = '';
		if(fmt === 'bestaudio') cmd = `yt-dlp -x --audio-format mp3 -o "${out}" "${url}"`;
		else if(fmt === 'mp4') cmd = `yt-dlp -f bestvideo[ext=mp4]+bestaudio[ext=m4a]/mp4 -o "${out}" "${url}"`;
		else cmd = `yt-dlp -f best -o "${out}" "${url}"`;
		const ps = cmd.replace(/"/g, '"');
		document.getElementById('ytCmd').value = `# Run in a terminal on your machine\n${cmd}`;
	});
	copyBtn.addEventListener('click', async () => {
		const t = document.getElementById('ytCmd').value;
		if(!t) return alert('Generate the command first');
		try {
			await navigator.clipboard.writeText(t);
			alert('Command copied to clipboard — run it locally');
		} catch (e) {
			alert('Copy failed — select and copy manually');
		}
	});
	