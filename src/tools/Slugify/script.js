	function slugifyText() {
		var input = document.getElementById('slugInput').value;
		var slug = input.toLowerCase().replace(/\s+/g, '-').replace(/[^a-z0-9\-]/g, '').replace(/-+/g, '-').replace(/^-|-$/g, '');
		document.getElementById('slugResult').textContent = slug;
	}