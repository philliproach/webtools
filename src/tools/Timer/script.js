	const mins = document.getElementById('minutes');
	const secs = document.getElementById('seconds');
	const display = document.getElementById('display');
	const labelInput = document.getElementById('label');
	let total = parseInt(mins.value || 0) * 60 + parseInt(secs.value || 0);
	let interval = null;

	function fmt(s) {
		const m = Math.floor(s / 60);
		const sec = s % 60;
		return `${String(m).padStart(2, '0')}:${String(sec).padStart(2, '0')}`
	}

	function updateDisplay() {
		display.textContent = fmt(total);
	}
	mins.addEventListener('change', () => {
		total = parseInt(mins.value || 0) * 60 + parseInt(secs.value || 0);
		updateDisplay();
	});
	secs.addEventListener('change', () => {
		total = parseInt(mins.value || 0) * 60 + parseInt(secs.value || 0);
		updateDisplay();
	});
	document.querySelectorAll('[data-min]').forEach(b => b.addEventListener('click', (e) => {
		const m = parseInt(e.currentTarget.dataset.min);
		mins.value = m;
		secs.value = 0;
		total = m * 60;
		updateDisplay();
	}));

	function tick() {
		if(total <= 0) {
			clearInterval(interval);
			interval = null;
			notifyFinish();
			return;
		}
		total--;
		updateDisplay();
	}
	document.getElementById('start').addEventListener('click', () => {
		if(!interval) {
			interval = setInterval(tick, 1000);
		}
	});
	document.getElementById('pause').addEventListener('click', () => {
		if(interval) {
			clearInterval(interval);
			interval = null;
		}
	});
	document.getElementById('reset').addEventListener('click', () => {
		if(interval) {
			clearInterval(interval);
			interval = null;
		}
		total = parseInt(mins.value || 0) * 60 + parseInt(secs.value || 0);
		updateDisplay();
	});

	function notifyFinish() {
		const label = labelInput.value || 'Timer';
		if(typeof Notification !== 'undefined' && Notification.permission === 'granted') {
			new Notification(`${label} finished`);
		} else if(typeof Notification !== 'undefined' && Notification.permission !== 'denied') {
			Notification.requestPermission().then(p => {
				if(p === 'granted') new Notification(`${label} finished`);
				else alert(`${label} finished`);
			});
		} else {
			alert(`${label} finished`);
		}
	}
	updateDisplay();
	