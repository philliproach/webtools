	function render() {
		const arr = JSON.parse(localStorage.getItem('webtools-expenses') || '[]');
		const list = document.getElementById('list');
		list.innerHTML = arr.map(e => `<div style="display:flex;justify-content:space-between;padding:.5rem;border:1px solid rgba(0,0,0,.06);border-radius:6px;margin-bottom:.4rem"><div><strong>${escapeHtml(e.desc)}</strong><div class="muted-small">${new Date(e.t).toLocaleString()}</div></div><div>$${Number(e.amt).toFixed(2)} <button data-id="${e.id}" class="del tool-btn">Del</button></div></div>`).join('');
		document.getElementById('total').textContent = 'Total: $' + arr.reduce((s, x) => s + Number(x.amt), 0).toFixed(2);
		document.querySelectorAll('.del').forEach(b => b.addEventListener('click', e => {
			const id = e.target.dataset.id;
			let a = JSON.parse(localStorage.getItem('webtools-expenses') || '[]');
			a = a.filter(x => x.id != id);
			localStorage.setItem('webtools-expenses', JSON.stringify(a));
			render();
		}));
	}

	function escapeHtml(s) {
		return s.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
	}
	document.getElementById('add').addEventListener('click', () => {
		const desc = document.getElementById('desc').value || 'Expense';
		const amt = document.getElementById('amt').value || 0;
		const arr = JSON.parse(localStorage.getItem('webtools-expenses') || '[]');
		arr.unshift({
			id: Date.now(),
			desc,
			amt,
			t: Date.now()
		});
		localStorage.setItem('webtools-expenses', JSON.stringify(arr));
		document.getElementById('desc').value = '';
		document.getElementById('amt').value = '';
		render();
	});
	document.getElementById('clear').addEventListener('click', () => {
		if(confirm('Clear all expenses?')) {
			localStorage.removeItem('webtools-expenses');
			render();
		}
	});
	render();
	