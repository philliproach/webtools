	const first = ['Alex', 'Sam', 'Jamie', 'Taylor', 'Jordan', 'Casey', 'Riley', 'Morgan', 'Avery', 'Charlie'];
	const last = ['Smith', 'Johnson', 'Brown', 'Taylor', 'Anderson', 'Thomas', 'Jackson', 'White', 'Harris', 'Martin'];
	document.getElementById('gen').addEventListener('click', () => {
		const cnt = Math.min(50, Math.max(1, parseInt(document.getElementById('count').value) || 5));
		const out = document.getElementById('out');
		out.innerHTML = '';
		for(let i = 0; i < cnt; i++) {
			const name = first[Math.floor(Math.random() * first.length)] + ' ' + last[Math.floor(Math.random() * last.length)];
			const el = document.createElement('div');
			el.textContent = name;
			out.appendChild(el);
		}
	});
	