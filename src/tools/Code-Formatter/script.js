	(function() {
		const params = new URLSearchParams(location.search);
		let lang = params.get('type') || 'js';
		const codeIn = document.getElementById('codeIn');
		const codeOut = document.getElementById('codeOut');
		const langButtons = document.querySelectorAll('[data-lang]');
		const beautifyBtn = document.getElementById('beautifyBtn');
		const minifyBtn = document.getElementById('minifyBtn');
		const copyBtn = document.getElementById('copyBtn');
		const indentSize = document.getElementById('indentSize');
		const landing = document.getElementById('landing');
		const statusEl = document.getElementById('status');
		const SAMPLES = {
			js: `// JavaScript sample\nfunction greet(name){console.log('Hello '+name);}greet('World');`,
			html: `<!-- HTML sample -->\n<!doctype html>\n<html><head><meta charset="utf-8"></head><body><h1>Hello</h1></body></html>`,
			css: `/* CSS sample */\nbody{margin:0;font-family:system-ui}h1{color:#0b74de}`,
			json: `{"name":"WebTools","version":1,"items":[1,2,3]}`,
			xml: `<?xml version="1.0"?><note><to>User</to><from>WebTools</from><body>Hello</body></note>`,
			python: `# Python sample\ndef greet(name):\n    print(f"Hello {name}")\n\nif __name__ == '__main__':\n    greet('World')\n`
		};

		function setActive(l) {
			lang = l;
			langButtons.forEach(b => b.classList.toggle('active', b.getAttribute('data-lang') === l));
			codeIn.placeholder = 'Paste your ' + l + ' code here...';
			renderLanding(l);
			try {
				const u = new URL(location);
				u.searchParams.set('type', l);
				history.replaceState({}, '', u);
			} catch (e) {}
		}

		function renderLanding(l) {
			const titles = {
				js: 'JavaScript',
				html: 'HTML',
				css: 'CSS',
				json: 'JSON',
				xml: 'XML',
				python: 'Python'
			};
			const desc = {
				js: 'Format JavaScript code using js-beautify. Supports beautify and a basic minify.',
				html: 'Format HTML markup. Beautify will indent nested elements.',
				css: 'Format CSS rules and selectors.',
				json: 'Pretty-print or minify JSON. Invalid JSON will throw an error.',
				xml: 'Pretty-print or compact XML. XML formatter is a simple, client-side implementation.',
				python: 'Basic Python whitespace normalizer: converts tabs to spaces, trims trailing whitespace, and collapses extra blank lines. For full formatting use a server-side tool like Black.'
			};
			landing.innerHTML = `
                    <div style="display:flex;align-items:center;justify-content:space-between;gap:1rem">
                      <div>
                        <strong style="font-size:1.05rem">${titles[l]} Formatter</strong>
                        <div class="muted-note" style="margin-top:.25rem">${desc[l]}</div>
                      </div>
                      <div style="display:flex;gap:.5rem">
                        <button class="tool-btn" id="loadSample">Load sample</button>
                        <button class="tool-btn" id="clearBtn">Clear</button>
                      </div>
                    </div>
                `;
			document.getElementById('loadSample').addEventListener('click', () => {
				codeIn.value = SAMPLES[l];
				codeIn.focus();
			});
			document.getElementById('clearBtn').addEventListener('click', () => {
				codeIn.value = '';
				codeIn.focus();
			});
		}
		langButtons.forEach(b => b.addEventListener('click', () => setActive(b.getAttribute('data-lang'))));
		setActive(lang);

		function beautify() {
			const indent = parseInt(indentSize.value, 10) || 2;
			const val = codeIn.value;
			try {
				let out = val;
				if(lang === 'js') {
					out = (typeof js_beautify === 'function') ? js_beautify(val, {
						indent_size: indent
					}) : val;
				} else if(lang === 'html') {
					if(typeof html_beautify === 'function') {
						out = html_beautify(val, {
							indent_size: indent
						});
					} else if(typeof js_beautify === 'function') {
						out = js_beautify(val, {
							indent_size: indent
						});
					} else {
						throw new Error('HTML beautifier not available');
					}
				} else if(lang === 'css') {
					if(typeof css_beautify === 'function') {
						out = css_beautify(val, {
							indent_size: indent
						});
					} else if(typeof js_beautify === 'function') {
						out = js_beautify(val, {
							indent_size: indent
						});
					} else {
						throw new Error('CSS beautifier not available');
					}
				} else if(lang === 'json') {
					const parsed = JSON.parse(val);
					out = JSON.stringify(parsed, null, indent);
				} else if(lang === 'xml') {
					out = formatXml(val, indent);
				} else if(lang === 'python') {
					out = val.replace(/\t/g, '    ');
					out = out.split('\n').map(l => l.replace(/[ \t]+$/, '')).join('\n');
					out = out.replace(/\n{3,}/g, '\n\n');
				}
				codeOut.value = out;
				statusEl.textContent = 'Status: OK';
				statusEl.style.color = 'var(--ok-color, green)';
				try {
					codeOut.scrollIntoView({
						behavior: 'smooth',
						block: 'center'
					});
					codeOut.focus({
						preventScroll: true
					});
				} catch (e) {
					}
			} catch (e) {
				statusEl.textContent = 'Status: Error';
				statusEl.style.color = 'var(--danger-color, red)';
				alert('Format error: ' + e.message);
				console.error(e);
			}
		}

		function minify() {
			const val = codeIn.value;
			try {
				let out = val;
				if(lang === 'js') {
					out = (typeof js_beautify === 'function') ? js_beautify(val, {
						indent_size: 0,
						max_preserve_newlines: 0,
						space_in_empty_paren: false
					}).replace(/\n+/g, '') : val.replace(/\n+/g, '');
				} else if(lang === 'html') {
					if(typeof html_beautify === 'function') {
						out = html_beautify(val, {
							indent_size: 0
						}).replace(/\n+/g, '');
					} else if(typeof js_beautify === 'function') {
						out = js_beautify(val, {
							indent_size: 0
						}).replace(/\n+/g, '');
					} else {
						out = val.replace(/\n+/g, '');
					}
				} else if(lang === 'css') {
					if(typeof css_beautify === 'function') {
						out = css_beautify(val, {
							indent_size: 0
						}).replace(/\n+/g, '');
					} else if(typeof js_beautify === 'function') {
						out = js_beautify(val, {
							indent_size: 0
						}).replace(/\n+/g, '');
					} else {
						out = val.replace(/\n+/g, '');
					}
				} else if(lang === 'json') {
					const parsed = JSON.parse(val);
					out = JSON.stringify(parsed);
				} else if(lang === 'xml') {
					out = val.replace(/>\s+</g, '><').trim();
				} else if(lang === 'python') {
					out = val.replace(/\t/g, '    ');
					out = out.split('\n').map(l => l.replace(/[ \t]+$/, '')).join('\n');
					out = out.replace(/\n{3,}/g, '\n\n').trim();
				}
				codeOut.value = out;
				statusEl.textContent = 'Status: OK';
				statusEl.style.color = 'var(--ok-color, green)';
				try {
					codeOut.scrollIntoView({
						behavior: 'smooth',
						block: 'center'
					});
					codeOut.focus({
						preventScroll: true
					});
				} catch (e) {
					 }
			} catch (e) {
				statusEl.textContent = 'Status: Error';
				statusEl.style.color = 'var(--danger-color, red)';
				alert('Minify error: ' + e.message);
				console.error(e);
			}
		}

		function formatXml(xml, indent) {
			const PADDING = ' '.repeat(indent);
			const reg = /(>)(<)(\/?)/g;
			let xmlStr = xml.replace(/\r?\n/g, '').replace(reg, '$1\n$2$3');
			const lines = xmlStr.split('\n');
			let level = 0;
			for(let i = 0; i < lines.length; i++) {
				const line = lines[i].trim();
				if(/<\/.+>/.test(line)) level--;
				lines[i] = PADDING.repeat(level) + line;
				if(/<[^!].*[^\/]$/.test(line) && !/^<\?/.test(line) && !/<\/.+>/.test(line)) level++;
			}
			return lines.join('\n');
		}
		beautifyBtn.addEventListener('click', beautify);
		minifyBtn.addEventListener('click', minify);
		copyBtn.addEventListener('click', () => {
			const text = codeOut.value || codeIn.value;
			if(!text) return alert('Nothing to copy');
			navigator.clipboard.writeText(text).then(() => {
				copyBtn.textContent = 'Copied';
				setTimeout(() => copyBtn.textContent = 'Copy', 1500);
			});
		});

		function checkAvailability() {
			const missing = [];
			if(typeof js_beautify !== 'function') missing.push('js_beautify');
			if(typeof html_beautify !== 'function') missing.push('html_beautify');
			if(typeof css_beautify !== 'function') missing.push('css_beautify');
			if(missing.length) {
				statusEl.textContent = 'Status: Partial (missing ' + missing.join(', ') + ')';
				statusEl.style.color = 'orange';
			} else {
				statusEl.textContent = 'Status: Ready';
				statusEl.style.color = 'var(--ok-color, green)';
			}
		}
		if(params.get('type')) {
			setActive(params.get('type'));
			codeIn.focus();
		}
		setTimeout(checkAvailability, 500);
	})();