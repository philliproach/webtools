	document.getElementById('calc').addEventListener('click', () => {
		const w = parseFloat(document.getElementById('weight').value) || 0;
		const h = parseFloat(document.getElementById('height').value) || 0;
		const m = h / 100;
		const bmi = w / (m * m);
		let cat = '';
		if(bmi < 18.5) cat = 'Underweight';
		else if(bmi < 25) cat = 'Normal';
		else if(bmi < 30) cat = 'Overweight';
		else cat = 'Obese';
		document.getElementById('out').innerHTML = `BMI: ${bmi.toFixed(1)} — ${cat}`;
	});