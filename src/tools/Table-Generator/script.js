	(function() {
		const rowsEl = document.getElementById('rows');
		const colsEl = document.getElementById('cols');
		const genBtn = document.getElementById('genBtn');
		const editorArea = document.getElementById('editorArea');
		const loadSample = document.getElementById('loadSample');
		const clearBtn = document.getElementById('clearBtn');
		const addRow = document.getElementById('addRow');
		const addCol = document.getElementById('addCol');
		const styleSelect = document.getElementById('styleSelect');
		const renderBtn = document.getElementById('renderBtn');
		const outputEl = document.getElementById('output');
		const copyBtn = document.getElementById('copyBtn');
		const downloadBtn = document.getElementById('downloadBtn');
		const chartArea = document.getElementById('chartArea');
		let table = [];

		function makeTable(r, c) {
			table = [];
			for(let i = 0; i < r; i++) {
				const row = [];
				for(let j = 0; j < c; j++) row.push(i === 0 ? ('Header ' + (j + 1)) : '');
				table.push(row);
			}
			renderEditor();
		}

		function renderEditor() {
			editorArea.innerHTML = '';
			const tbl = document.createElement('table');
			tbl.className = 'tg-table';
			const thead = document.createElement('thead');
			const hrow = document.createElement('tr');
			(table[0] || []).forEach((v, ci) => {
				const th = document.createElement('th');
				th.contentEditable = 'true';
				th.textContent = v || 'Header ' + (ci + 1);
				th.addEventListener('input', () => {
					table[0][ci] = th.textContent;
				});
				hrow.appendChild(th);
			});
			thead.appendChild(hrow);
			tbl.appendChild(thead);
			const tbody = document.createElement('tbody');
			for(let i = 1; i < table.length; i++) {
				const tr = document.createElement('tr');
				table[i].forEach((v, ci) => {
					const td = document.createElement('td');
					td.contentEditable = 'true';
					td.textContent = v || '';
					td.addEventListener('input', () => {
						table[i][ci] = td.textContent;
					});
					tr.appendChild(td);
				});
				tbody.appendChild(tr);
			}
			tbl.appendChild(tbody);
			editorArea.appendChild(tbl);
		}

		function tableToCSV() {
			return table.map(r => r.map(cell => '"' + String(cell).replace(/"/g, '""') + '"').join(',')).join('\n');
		}

		function tableToMarkdown() {
			const header = table[0] || [];
			const rows = table.slice(1) || [];
			const hdr = '| ' + header.join(' | ') + ' |';
			const sep = '| ' + header.map(() => '---').join(' | ') + ' |';
			const body = rows.map(r => '| ' + r.join(' | ') + ' |').join('\n');
			return [hdr, sep, body].join('\n');
		}

		function tableToJSON() {
			const keys = table[0] || [];
			const rows = table.slice(1) || [];
			return JSON.stringify(rows.map(r => {
				const obj = {};
				keys.forEach((k, ci) => obj[k || ('col' + (ci + 1))] = r[ci] || '');
				return obj;
			}), null, 2);
		}

		function renderOutput() {
			chartArea.innerHTML = '';
			const mode = styleSelect.value;
			if(mode === 'table') {
				const wrapper = document.createElement('div');
				const tbl = document.createElement('table');
				tbl.className = 'tg-table';
				const thead = document.createElement('thead');
				const htr = document.createElement('tr');
				(table[0] || []).forEach(h => {
					const th = document.createElement('th');
					th.textContent = h;
					htr.appendChild(th);
				});
				thead.appendChild(htr);
				tbl.appendChild(thead);
				const tbody = document.createElement('tbody');
				table.slice(1).forEach(r => {
					const tr = document.createElement('tr');
					r.forEach(c => {
						const td = document.createElement('td');
						td.textContent = c;
						tr.appendChild(td);
					});
					tbody.appendChild(tr);
				});
				tbl.appendChild(tbody);
				wrapper.appendChild(tbl);
				outputEl.value = wrapper.innerHTML;
			} else if(mode === 'csv') {
				outputEl.value = tableToCSV();
			} else if(mode === 'markdown') {
				outputEl.value = tableToMarkdown();
			} else if(mode === 'json') {
				outputEl.value = tableToJSON();
			} else if(mode === 'barchart') {
				const rows = table.slice(1) || [];
				const parsed = rows.map(r => ({
					label: r[0] || '',
					value: parseFloat((r[1] || '').toString().replace(/[^0-9\.\-]/g, '')) || 0
				}));
				const max = Math.max(1, ...parsed.map(p => p.value));
				chartArea.innerHTML = '';
				parsed.forEach(p => {
					const div = document.createElement('div');
					div.className = 'chart-bar';
					const pct = Math.round((p.value / max) * 100);
					div.style.width = pct + '%';
					div.textContent = p.label + ' (' + p.value + ')';
					chartArea.appendChild(div);
				});
				outputEl.value = 'Bar chart displayed below';
			}
		}
		genBtn.addEventListener('click', () => {
			const r = parseInt(rowsEl.value, 10) || 1;
			const c = parseInt(colsEl.value, 10) || 1;
			makeTable(r, c);
		});
		loadSample.addEventListener('click', () => {
			table = [
				['Name', 'Value', 'Notes'],
				['Apples', '10', 'green'],
				['Bananas', '7', 'yellow'],
				['Cherries', '15', 'red']
			];
			renderEditor();
		});
		clearBtn.addEventListener('click', () => {
			table = [
				['Header 1']
			];
			renderEditor();
			outputEl.value = '';
			chartArea.innerHTML = '';
		});
		addRow.addEventListener('click', () => {
			const c = table[0] ? table[0].length : 1;
			const r = new Array(c).fill('');
			table.push(r);
			renderEditor();
		});
		addCol.addEventListener('click', () => {
			table.forEach((row, ri) => {
				row.push(ri === 0 ? ('Header ' + row.length) : '');
			});
			renderEditor();
		});
		renderBtn.addEventListener('click', () => {
			renderOutput();
			try {
				outputEl.scrollIntoView({
					behavior: 'smooth',
					block: 'center'
				});
				outputEl.focus({
					preventScroll: true
				});
			} catch (e) {}
		});
		copyBtn.addEventListener('click', () => {
			const txt = outputEl.value;
			if(!txt) return alert('Nothing to copy');
			navigator.clipboard.writeText(txt).then(() => {
				copyBtn.textContent = 'Copied';
				setTimeout(() => copyBtn.textContent = 'Copy', 1200);
			});
		});
		downloadBtn.addEventListener('click', () => {
			const mode = styleSelect.value;
			const content = outputEl.value || '';
			const ext = mode === 'json' ? 'json' : (mode === 'csv' ? 'csv' : (mode === 'markdown' ? 'md' : 'html'));
			const blob = new Blob([content], {
				type: 'text/plain;charset=utf-8'
			});
			const a = document.createElement('a');
			a.href = URL.createObjectURL(blob);
			a.download = 'table.' + ext;
			document.body.appendChild(a);
			a.click();
			a.remove();
		});
		makeTable(4, 3);
	})();
	