	function render() {
		const list = JSON.parse(localStorage.getItem('webtools-todos') || '[]');
		const el = document.getElementById('tasks');
		el.innerHTML = list.map(t => `<div style="display:flex;align-items:center;justify-content:space-between;padding:.5rem;border:1px solid rgba(0,0,0,.06);border-radius:6px;margin-bottom:.5rem"><label style="display:flex;align-items:center;gap:.5rem"><input type="checkbox" data-id="${t.id}" ${t.done ? 'checked' : ''}> <span style="text-decoration:${t.done ? 'line-through' : ''}">${escapeHtml(t.text)}</span></label><div><button data-id="${t.id}" class="del tool-btn">Delete</button></div></div>`).join('');
		document.querySelectorAll('.del').forEach(b => b.addEventListener('click', e => {
			const id = e.target.dataset.id;
			let arr = JSON.parse(localStorage.getItem('webtools-todos') || '[]');
			arr = arr.filter(x => x.id != id);
			localStorage.setItem('webtools-todos', JSON.stringify(arr));
			render();
		}));
		document.querySelectorAll('input[type=checkbox]').forEach(cb => cb.addEventListener('change', e => {
			const id = e.target.dataset.id;
			const arr = JSON.parse(localStorage.getItem('webtools-todos') || '[]');
			const it = arr.find(x => x.id == id);
			if(it) {
				it.done = e.target.checked;
				localStorage.setItem('webtools-todos', JSON.stringify(arr));
				render();
			}
		}));
	}

	function escapeHtml(s) {
		return s.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
	}
	document.getElementById('add').addEventListener('click', () => {
		const t = document.getElementById('task').value.trim();
		if(!t) return;
		const arr = JSON.parse(localStorage.getItem('webtools-todos') || '[]');
		arr.unshift({
			id: Date.now(),
			text: t,
			done: false
		});
		localStorage.setItem('webtools-todos', JSON.stringify(arr));
		document.getElementById('task').value = '';
		render();
	});
	render();