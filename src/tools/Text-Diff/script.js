	function diffLines(a, b) {
		const A = a.split('\n');
		const B = b.split('\n');
		const out = [];
		const max = Math.max(A.length, B.length);
		for(let i = 0; i < max; i++) {
			const aa = A[i] || '';
			const bb = B[i] || '';
			if(aa === bb) out.push(`<div class="muted"> ${escapeHtml(aa)}</div>`);
			else out.push(`<div style="background:#ffeef0;border-left:4px solid #d73a49;padding:6px;margin-bottom:4px"><strong>-${escapeHtml(aa)}</strong><br><strong>+${escapeHtml(bb)}</strong></div>`);
		}
		return out.join('');
	}

	function escapeHtml(s) {
		return s.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
	}
	document.getElementById('run').addEventListener('click', () => {
		const a = document.getElementById('a').value;
		const b = document.getElementById('b').value;
		document.getElementById('out').innerHTML = diffLines(a, b);
	});
	