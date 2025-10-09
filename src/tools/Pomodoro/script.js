	let total = 25 * 60;
	let interval = null;
	const display = document.getElementById('time');

	function fmt(s) {
		const m = Math.floor(s / 60);
		const sec = s % 60;
		return `${String(m).padStart(2, '0')}:${String(sec).padStart(2, '0')}`
	}

	function tick() {
		if(total <= 0) {
			clearInterval(interval);
			interval = null;
			alert('Pomodoro finished');
			return;
		}
		total--;
		display.textContent = fmt(total);
	}
	document.getElementById('start').addEventListener('click', () => {
		if(!interval) interval = setInterval(tick, 1000);
	});
	document.getElementById('pause').addEventListener('click', () => {
		if(interval) {
			clearInterval(interval);
			interval = null;
		}
	});
	document.getElementById('reset').addEventListener('click', () => {
		total = 25 * 60;
		display.textContent = fmt(total);
		if(interval) {
			clearInterval(interval);
			interval = null;
		}
	});
	document.getElementById('preset-25').addEventListener('click', () => {
		total = 25 * 60;
		display.textContent = fmt(total);
	});
	document.getElementById('preset-15').addEventListener('click', () => {
		total = 15 * 60;
		display.textContent = fmt(total);
	});
	document.getElementById('preset-5').addEventListener('click', () => {
		total = 5 * 60;
		display.textContent = fmt(total);
	});
	