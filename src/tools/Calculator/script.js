	const display = document.getElementById('display');
	let expr = '';

	function update() {
		display.value = expr || '0';
	}

	function safeAppend(ch) {
		expr += ch;
		update();
	}
	document.querySelectorAll('.calc-btn').forEach(b => {
		b.addEventListener('click', e => {
			const id = b.id;
			if(id === 'clear') {
				expr = '';
				update();
				return;
			}
			if(id === 'back') {
				expr = expr.slice(0, -1);
				update();
				return;
			}
			if(id === 'equals') {
				evaluate();
				return;
			}
			const v = b.dataset.val;
			if(v) safeAppend(v);
		});
	});

	function evaluate() {
		try {
			if(!/^[0-9+\-*/(). %]+$/.test(expr)) {
				alert('Invalid characters');
				return;
			}
			const withPercent = expr.replace(/(\d+(?:\.\d+)?)%/g, '($1/100)');
			const result = Function('return (' + withPercent + ')')();
			expr = String(result);
			update();
		} catch (e) {
			alert('Error in expression');
		}
	}
	window.addEventListener('keydown', e => {
		if(e.key === 'Enter') {
			evaluate();
			e.preventDefault();
			return;
		}
		if(e.key === 'Backspace') {
			expr = expr.slice(0, -1);
			update();
			return;
		}
		if(/^[0-9+\-*/().%]$/.test(e.key)) {
			expr += e.key;
			update();
		}
	});
	update();