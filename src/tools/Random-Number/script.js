	function generateRandom() {
		var min = parseInt(document.getElementById('min').value);
		var max = parseInt(document.getElementById('max').value);
		if(isNaN(min) || isNaN(max) || min > max) {
			document.getElementById('result').textContent = 'Enter valid min and max values.';
			return;
		}
		var rand = Math.floor(Math.random() * (max - min + 1)) + min;
		document.getElementById('result').textContent = 'Random Number: ' + rand;
	}
	