	const features = [
		['Service Worker', 'serviceWorker' in navigator],
		['WebAssembly', typeof WebAssembly !== 'undefined'],
		['WebCrypto', !!(window.crypto && crypto.subtle)],
		['OffscreenCanvas', 'OffscreenCanvas' in window],
		['WebGL', (() => {
			try {
				const c = document.createElement('canvas');
				return !!(c.getContext('webgl') || c.getContext('experimental-webgl'));
			} catch (e) {
				return false;
			}
		})()],
		['WebRTC', 'RTCPeerConnection' in window],
		['Clipboard API', navigator.clipboard && navigator.clipboard.writeText],
		['File System Access', 'showOpenFilePicker' in window || 'chooseFileSystemEntries' in window],
		['Notifications', 'Notification' in window],
		['Push', 'PushManager' in window],
		['WebMIDI', 'requestMIDIAccess' in navigator]
	];
	const out = document.getElementById('out');
	out.innerHTML = features.map(f => `<div style="display:flex;justify-content:space-between;padding:6px 0;border-bottom:1px solid rgba(0,0,0,.04)"><span>${f[0]}</span><strong style="color:${f[1] ? '#16a34a' : '#d73a49'}">${f[1] ? 'Supported' : 'Missing'}</strong></div>`).join('');
	