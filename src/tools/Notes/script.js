	function saveNote() {
		const title = document.getElementById('title').value || 'Untitled';
		const body = document.getElementById('body').value || '';
		const notes = JSON.parse(localStorage.getItem('webtools-notes') || '[]');
		notes.unshift({
			id: Date.now(),
			title,
			body
		});
		localStorage.setItem('webtools-notes', JSON.stringify(notes));
		render();
	}

	function render() {
		const notes = JSON.parse(localStorage.getItem('webtools-notes') || '[]');
		const list = document.getElementById('list');
		list.innerHTML = notes.map(n => `<div style="padding:.6rem;border:1px solid rgba(0,0,0,.06);border-radius:6px;margin-bottom:.5rem"><strong>${escapeHtml(n.title)}</strong><div style="font-size:.9rem;margin-top:.35rem">${escapeHtml(n.body.slice(0, 200))}</div><div style="margin-top:.4rem"><button data-id="${n.id}" class="load tool-btn">Load</button><button data-id="${n.id}" class="del tool-btn">Delete</button></div></div>`).join('');
		document.querySelectorAll('.load').forEach(b => b.addEventListener('click', e => {
			const id = e.target.dataset.id;
			const note = JSON.parse(localStorage.getItem('webtools-notes') || '[]').find(x => x.id == id);
			if(note) {
				document.getElementById('title').value = note.title;
				document.getElementById('body').value = note.body;
			}
		}));
		document.querySelectorAll('.del').forEach(b => b.addEventListener('click', e => {
			const id = e.target.dataset.id;
			let notes = JSON.parse(localStorage.getItem('webtools-notes') || '[]');
			notes = notes.filter(x => x.id != id);
			localStorage.setItem('webtools-notes', JSON.stringify(notes));
			render();
		}));
	}

	function escapeHtml(s) {
		return s.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
	}
	document.getElementById('save').addEventListener('click', saveNote);
	render();
	