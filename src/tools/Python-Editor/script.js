	let pyodideReady = false;
	let pyodide;
	async function loadPyodide() {
		pyodide = await window.loadPyodide();
		pyodideReady = true;
	}
	loadPyodide();
	async function runPython() {
		if(!pyodideReady) {
			document.getElementById('pyOutput').textContent = 'Pyodide is still loading...';
			return;
		}
		const code = document.getElementById('pyInput').value;
		let output = '';
		try {
			pyodide.setStdout({
				batched: (s) => {
					output += s;
				},
			});
			pyodide.setStderr({
				batched: (s) => {
					output += s;
				},
			});
			await pyodide.runPythonAsync(code);
			document.getElementById('pyOutput').textContent = output;
		} catch (e) {
			output += e;
			document.getElementById('pyOutput').textContent = output;
		} finally {
			pyodide.setStdout();
			pyodide.setStderr();
		}
	}
	