	(function() {
		const startBtn = document.getElementById('startBtn');
		const downloadBtn = document.getElementById('downloadBtn');
		const copyBtn = document.getElementById('copyBtn');
		const baseEl = document.getElementById('baseUrl');
		const pasteEl = document.getElementById('pasteUrls');
		const outEl = document.getElementById('sitemapOut');
		const statusEl = document.getElementById('status');
		const maxPagesEl = document.getElementById('maxPages');
		const maxDepthEl = document.getElementById('maxDepth');

		function logStatus(msg, cls) {
			statusEl.textContent = msg;
			statusEl.className = cls ? ('status ' + cls) : 'status';
		}

		function normalizeUrl(u) {
			try {
				return (new URL(u)).href.replace(/#.*$/, '');
			} catch (e) {
				return null;
			}
		}
		async function crawl(startUrl, maxPages, maxDepth) {
			const start = normalizeUrl(startUrl);
			if(!start) throw new Error('Invalid start URL');
			const origin = (new URL(start)).origin;
			const visited = new Set();
			const queue = [{
				url: start,
				depth: 0
			}];
			const results = [];
			const failures = [];
			while(queue.length && results.length < maxPages) {
				const {
					url,
					depth
				} = queue.shift();
				if(visited.has(url)) continue;
				visited.add(url);
				try {
					logStatus(`Fetching ${url} (found ${results.length})`);
					const resp = await fetch(url, {
						mode: 'cors'
					});
					if(!resp.ok) {
						failures.push({
							url,
							status: resp.status
						});
						continue;
					}
					const text = await resp.text();
					results.push(url);
					if(depth < maxDepth) {
						try {
							const doc = new DOMParser().parseFromString(text, 'text/html');
							const anchors = Array.from(doc.querySelectorAll('a[href]')).map(a => a.getAttribute('href'));
							for(const href of anchors) {
								try {
									const abs = new URL(href, url);
									if(abs.origin === origin) {
										const candidate = abs.href.replace(/#.*$/, '');
										if(!visited.has(candidate) && !queue.some(q => q.url === candidate)) {
											queue.push({
												url: candidate,
												depth: depth + 1
											});
										}
									}
								} catch (e) {}
							}
						} catch (e) {}
					}
				} catch (err) {
					failures.push({
						url,
						error: err.message
					});
				}
			}
			return {
				results,
				failures
			};
		}

		function urlsToSitemap(urls) {
			const lastmod = new Date().toISOString();
			const lines = ['<?xml version="1.0" encoding="UTF-8"?>', '<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">'];
			for(const u of urls) {
				lines.push('  <url>');
				lines.push('    <loc>' + escapeXml(u) + '</loc>');
				lines.push('    <lastmod>' + lastmod + '</lastmod>');
				lines.push('    <priority>0.64</priority>');
				lines.push('  </url>');
			}
			lines.push('</urlset>');
			return lines.join('\n');
		}

		function escapeXml(s) {
			return s.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
		}
		async function generate() {
			outEl.value = '';
			const pasted = pasteEl.value.trim();
			const maxPages = parseInt(maxPagesEl.value, 10) || 200;
			const maxDepth = parseInt(maxDepthEl.value, 10) || 2;
			if(pasted) {
				const lines = pasted.split(/\r?\n/).map(l => l.trim()).filter(Boolean).map(normalizeUrl).filter(Boolean);
				if(!lines.length) {
					logStatus('No valid URLs found in paste', 'failed');
					return;
				}
				const xml = urlsToSitemap([...new Set(lines)]);
				outEl.value = xml;
				logStatus('Sitemap generated from pasted URLs', 'success');
				return;
			}
			const base = baseEl.value.trim();
			if(!base) {
				logStatus('Enter a base URL', 'failed');
				return;
			}
			try {
				logStatus('Starting crawl…');
				const {
					results,
					failures
				} = await crawl(base, maxPages, maxDepth);
				if(results.length === 0) {
					logStatus('No pages found during crawl. Likely blocked by CORS or invalid start URL.', 'failed');
					outEl.value = '';
					return;
				}
				const xml = urlsToSitemap(results);
				outEl.value = xml;
				let msg = `Crawl finished: ${results.length} pages.`;
				if(failures.length) msg += ` ${failures.length} pages failed (CORS or HTTP errors).`;
				logStatus(msg, failures.length ? 'failed' : 'success');
			} catch (e) {
				logStatus('Error: ' + e.message, 'failed');
			}
		}

		function downloadXml() {
			const xml = outEl.value || '';
			if(!xml) {
				logStatus('Nothing to download', 'failed');
				return;
			}
			const blob = new Blob([xml], {
				type: 'application/xml'
			});
			const url = URL.createObjectURL(blob);
			const a = document.createElement('a');
			a.href = url;
			a.download = 'sitemap.xml';
			document.body.appendChild(a);
			a.click();
			a.remove();
			URL.revokeObjectURL(url);
			logStatus('Download started', 'success');
		}
		async function copyXml() {
			const val = outEl.value || '';
			if(!val) {
				logStatus('Nothing to copy', 'failed');
				return;
			}
			try {
				await navigator.clipboard.writeText(val);
				logStatus('Copied to clipboard', 'success');
			} catch (e) {
				logStatus('Copy failed: ' + e.message, 'failed');
			}
		}
		startBtn.addEventListener('click', generate);
		downloadBtn.addEventListener('click', downloadXml);
		copyBtn.addEventListener('click', copyXml);
	})();