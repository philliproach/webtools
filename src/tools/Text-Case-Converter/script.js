	const inEl = document.getElementById('in');
	const out = document.getElementById('out');

	function titleCase(s) {
		return s.replace(/\w\S*/g, t => t.charAt(0).toUpperCase() + t.substr(1).toLowerCase());
	}
	document.getElementById('upper').addEventListener('click', () => {
		out.textContent = inEl.value.toUpperCase();
	});
	document.getElementById('lower').addEventListener('click', () => {
		out.textContent = inEl.value.toLowerCase();
	});
	document.getElementById('title').addEventListener('click', () => {
		out.textContent = titleCase(inEl.value);
	});
	document.getElementById('snake').addEventListener('click', () => {
		out.textContent = inEl.value.trim().replace(/\s+/g, '_').toLowerCase();
	});
	document.getElementById('kebab').addEventListener('click', () => {
		out.textContent = inEl.value.trim().replace(/\s+/g, '-').toLowerCase();
	});
	