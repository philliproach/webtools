	function convert() {
		const v = parseFloat(document.getElementById('value').value) || 0;
		const from = document.getElementById('from').value;
		const to = document.getElementById('to').value;
		let meters = v;
		if(from === 'km') meters = v * 1000;
		if(from === 'm') meters = v;
		if(from === 'mi') meters = v * 1609.344;
		if(from === 'ft') meters = v * 0.3048;
		if(from === 'kg' || from === 'lb' || to === 'kg' || to === 'lb') {
			let kg = v;
			if(from === 'lb') kg = v * 0.45359237;
			if(to === 'kg') return document.getElementById('out').textContent = `${kg.toFixed(4)} kg`;
			if(to === 'lb') return document.getElementById('out').textContent = `${(kg / 0.45359237).toFixed(4)} lb`;
		}
		if((from === 'c' || from === 'f') || (to === 'c' || to === 'f')) {
			if(from === 'c' && to === 'f') return document.getElementById('out').textContent = `${(v * 9 / 5 + 32).toFixed(2)} °F`;
			if(from === 'f' && to === 'c') return document.getElementById('out').textContent = `${((v - 32) * 5 / 9).toFixed(2)} °C`;
			return document.getElementById('out').textContent = `${v} °${from.toUpperCase()}`;
		}
		let result = meters;
		if(to === 'km') result = meters / 1000;
		if(to === 'm') result = meters;
		if(to === 'mi') result = meters / 1609.344;
		if(to === 'ft') result = meters / 0.3048;
		document.getElementById('out').textContent = result.toFixed(4) + ' ' + (to);
	}
	document.getElementById('conv').addEventListener('click', convert);
	