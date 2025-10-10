const textEl = document.getElementById('text');
const fontEl = document.getElementById('font');
const sizeEl = document.getElementById('size');
const weightEl = document.getElementById('weight');
const preview = document.getElementById('preview');
const copyBtn = document.getElementById('copy');
const loadGoogle = document.getElementById('loadGoogle');

function mapRange(text, upperStart, lowerStart) {
    return text.split('').map(ch => {
        if (ch >= 'A' && ch <= 'Z') {
            const code = upperStart + (ch.charCodeAt(0) - 65);
            return String.fromCodePoint(code);
        }
        if (ch >= 'a' && ch <= 'z') {
            const code = lowerStart + (ch.charCodeAt(0) - 97);
            return String.fromCodePoint(code);
        }
        return ch;
    }).join('');
}

function toFraktur(s) {
    try {
        return mapRange(s, 0x1D504, 0x1D51E);
    } catch (e) {
        return s;
    }
}

function toFullwidth(s) {
    return s.split('').map(c => {
        const code = c.charCodeAt(0);
        if (code >= 33 && code <= 126) return String.fromCharCode(0xFF01 + (code - 33));
        return c;
    }).join('');
}

function toSuperscript(s) {
    const map = { 'a': 'ᵃ', 'b': 'ᵇ', 'c': 'ᶜ', 'd': 'ᵈ', 'e': 'ᵉ', 'f': 'ᶠ', 'g': 'ᵍ', 'h': 'ʰ', 'i': 'ᶦ', 'j': 'ʲ', 'k': 'ᵏ', 'l': 'ˡ', 'm': 'ᵐ', 'n': 'ⁿ', 'o': 'ᵒ', 'p': 'ᵖ', 'q': 'ᵠ', 'r': 'ʳ', 's': 'ˢ', 't': 'ᵗ', 'u': 'ᵘ', 'v': 'ᵛ', 'w': 'ʷ', 'x': 'ˣ', 'y': 'ʸ', 'z': 'ᶻ', 'A': 'ᴬ', 'B': 'ᴮ', 'C': 'ᶜ', 'D': 'ᴰ', 'E': 'ᴱ', 'F': 'ᶠ', 'G': 'ᴳ', 'H': 'ᴴ', 'I': 'ᴵ', 'J': 'ᴶ', 'K': 'ᴷ', 'L': 'ᴸ', 'M': 'ᴹ', 'N': 'ᴺ', 'O': 'ᴼ', 'P': 'ᴾ', 'Q': 'ᵠ', 'R': 'ᴿ', 'S': 'ˢ', 'T': 'ᵀ', 'U': 'ᵁ', 'V': 'ⱽ', 'W': 'ᵂ', 'X': 'ˣ', 'Y': 'ʸ', 'Z': 'ᶻ' };
    return s.split('').map(c => map[c] || c).join('');
}

function toUpsideDown(s) {
    const map = {
        a: 'ɐ', b: 'q', c: 'ɔ', d: 'p', e: 'ǝ', f: 'ɟ', g: 'ɓ', h: 'ɥ', i: 'ı', j: 'ɾ', k: 'ʞ', l: 'ʃ', m: 'ɯ', n: 'u', o: 'o', p: 'd', q: 'b', r: 'ɹ', s: 's', t: 'ʇ', u: 'n', v: 'ʌ', w: 'ʍ', x: 'x', y: 'ʎ', z: 'z',
        A: '∀', B: '𐐒', C: 'Ɔ', D: '◖', E: 'Ǝ', F: 'Ⅎ', G: '⅁', H: 'H', I: 'I', J: 'ſ', K: 'K', L: '⅂', M: 'W', N: 'N', O: 'O', P: 'Ԁ', Q: 'Q', R: 'ᴚ', S: 'S', T: '⊥', U: '∩', V: 'Λ', W: 'M', X: 'X', Y: '⅄', Z: 'Z'
    };
    return s.split('').reverse().map(c => map[c] || c).join('');
}

function toCircled(s) {
    return s.split('').map(c => {
        if (c >= 'A' && c <= 'Z') return String.fromCodePoint(0x24B6 + (c.charCodeAt(0) - 65));
        if (c >= 'a' && c <= 'z') return String.fromCodePoint(0x24D0 + (c.charCodeAt(0) - 97));
        return c;
    }).join('');
}

function toDoubleStruckRange(s) {
    return mapRange(s, 0x1D538, 0x1D552);
}

function toBoldRange(s) {
    return mapRange(s, 0x1D400, 0x1D41A);
}

function toScriptRange(s) {
    return mapRange(s, 0x1D49C, 0x1D4B6);
}

function applyTransform(text, styleKey) {
    switch (styleKey) {
        case 'fancy-1': return toFraktur(text);
        case 'fancy-2': return toFullwidth(text);
        case 'fancy-3': return toSuperscript(text);
        case 'fancy-4': return toUpsideDown(text);
        case 'circled': return toCircled(text);
        case 'double': return toDoubleStruckRange(text);
        case 'bold': return toBoldRange(text);
        case 'script': return toScriptRange(text);
        default: return text;
    }
}

const googleLoadedSet = new Set();
function loadGoogleFont(name) {
    if (!name) return;
    const familyParam = name.includes('+') || name.includes('%2B') ? name : name.replace(/\s+/g, '+');
    if (googleLoadedSet.has(familyParam)) return;
    const link = document.createElement('link');
    link.rel = 'stylesheet';
    link.href = `https://fonts.googleapis.com/css2?family=${encodeURIComponent(familyParam)}:wght@300;400;700&display=swap`;
    document.head.appendChild(link);
    googleLoadedSet.add(familyParam);
}

function loadGoogleFontAsync(name, onStatus) {
    try {
        if (!name) return Promise.resolve();
        const familyParam = name.includes('+') || name.includes('%2B') ? name : name.replace(/\s+/g, '+');
        if (googleLoadedSet.has(familyParam)) {
            onStatus && onStatus('loaded');
            return Promise.resolve();
        }
        onStatus && onStatus('loading');
        return new Promise((resolve, reject) => {
            const link = document.createElement('link');
            link.rel = 'stylesheet';
            link.href = `https://fonts.googleapis.com/css2?family=${encodeURIComponent(familyParam)}:wght@300;400;700&display=swap`;
            link.onload = () => {
                googleLoadedSet.add(familyParam);
                onStatus && onStatus('loaded');
                resolve();
            };
            link.onerror = (e) => {
                onStatus && onStatus('error');
                reject(e);
            };
            document.head.appendChild(link);
        });
    } catch (e) {
        onStatus && onStatus('error');
        return Promise.reject(e);
    }
}

const extraGoogleFonts = [
    'Roboto', 'Inter', 'Open Sans', 'Lato', 'Montserrat', 'Poppins', 'Source Sans 3', 'Nunito', 'Merriweather', 'Playfair Display', 'Raleway', 'Oswald', 'Noto Sans', 'Ubuntu', 'PT Sans', 'Josefin Sans', 'Rubik', 'Karla', 'Fira Sans', 'Quicksand', 'Alegreya', 'Inconsolata', 'Work Sans', 'Bitter', 'Arimo', 'Barlow', 'Dancing Script', 'Bebas Neue', 'Anton', 'Cinzel', 'Comfortaa', 'Concert One', 'Caveat', 'Satisfy', 'Shadows Into Light', 'Great Vibes', 'Gloria Hallelujah', 'Pacifico', 'Fredoka One', 'Mukta', 'Manrope', 'Spectral', 'Varela Round', 'Yeseva One', 'Zilla Slab', 'Nunito Sans', 'Heebo', 'M PLUS Rounded 1c', 'Roboto Slab', 'Noto Serif', 'Playfair Display SC', 'Archivo', 'Exo 2', 'Amatic SC'
];

function addExtraFontOptions() {
    const existing = new Set(Array.from(fontEl.options).map(o => o.textContent.trim()));
    const groupGoogle = document.createElement('optgroup');
    groupGoogle.label = 'Google fonts';
    extraGoogleFonts.forEach(name => {
        if (existing.has(name)) return;
        const opt = document.createElement('option');
        opt.value = `'${name}', sans-serif`;
        opt.textContent = name;
        opt.dataset.google = name.replace(/\s+/g, '+');
        groupGoogle.appendChild(opt);
    });
    fontEl.appendChild(groupGoogle);

    const groupFancy = document.createElement('optgroup');
    groupFancy.label = 'Fancy (Unicode)';
    const fancyList = [
        ['fancy-1', 'Fraktur-style (𝔉𝓪𝓷𝓬𝔂)'],
        ['fancy-2', 'Fullwidth (Ｆｕｌｌｗｉｄｔｈ)'],
        ['fancy-3', 'Superscript (ᵗⁱⁿʸ)'],
        ['fancy-4', 'Upside-down (ɐqɔ)'],
        ['circled', 'Circled (ⒶⒷⒸ)'],
        ['bold', 'Mathematical Bold (𝐀𝐁𝐂)'],
        ['double', 'Double-struck (𝔸𝔹𝔻)'],
        ['script', 'Script (𝒜𝒷𝒸)']
    ];
    fancyList.forEach(([k, label]) => {
        const opt = document.createElement('option');
        opt.value = k;
        opt.textContent = label;
        groupFancy.appendChild(opt);
    });
    fontEl.appendChild(groupFancy);
}

addExtraFontOptions();

function buildCustomDropdown() {
    if (!fontEl) return;
    const wrapper = document.createElement('div');
    wrapper.className = 'custom-dropdown';
    fontEl.parentNode.insertBefore(wrapper, fontEl);
    wrapper.appendChild(fontEl);
    const toggle = document.createElement('div');
    toggle.className = 'custom-toggle';
    toggle.tabIndex = 0;
    toggle.textContent = fontEl.options[fontEl.selectedIndex] ? fontEl.options[fontEl.selectedIndex].textContent : 'Choose font';
    wrapper.insertBefore(toggle, fontEl);
    fontEl.style.display = 'none';

    const list = document.createElement('div');
    list.className = 'custom-list';
    list.style.display = 'none';
    wrapper.appendChild(list);

    function populateList() {
        list.innerHTML = '';
        let currentGroup = null;
        Array.from(fontEl.options).forEach(opt => {
            const groupLabel = opt.parentElement && opt.parentElement.tagName === 'OPTGROUP' ? opt.parentElement.label : null;
            if (groupLabel && currentGroup !== groupLabel) {
                const g = document.createElement('div'); g.className = 'custom-group'; g.textContent = groupLabel; list.appendChild(g);
                currentGroup = groupLabel;
            }
            const item = document.createElement('div');
            item.className = 'custom-item';
            item.textContent = opt.textContent;
            item.dataset.value = opt.value;
            item.dataset.google = opt.dataset.google || '';
            item.addEventListener('click', () => {
                fontEl.value = opt.value;
                toggle.textContent = opt.textContent;
                list.style.display = 'none';
                setTimeout(updatePreview, 10);
            });
            list.appendChild(item);
        });
    }
    populateList();

    toggle.addEventListener('click', () => { list.style.display = list.style.display === 'none' ? 'block' : 'none'; });
    toggle.addEventListener('keydown', (e) => {
        if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); list.style.display = 'block'; }
        if (e.key === 'ArrowDown') { e.preventDefault(); list.style.display = 'block'; const first = list.querySelector('.custom-item'); first && first.focus(); }
    });
    document.addEventListener('click', (e) => { if (!wrapper.contains(e.target)) list.style.display = 'none'; });

    fontSearchEl && fontSearchEl.addEventListener('input', () => {
        const q = (fontSearchEl.value || '').toLowerCase();
        Array.from(list.querySelectorAll('.custom-item')).forEach(it => { it.style.display = q && !it.textContent.toLowerCase().includes(q) ? 'none' : ''; });
    });
}

buildCustomDropdown();

const fontSearchEl = document.getElementById('fontSearch');
if (fontSearchEl) {
    fontSearchEl.addEventListener('input', (e) => {
        const q = (e.target.value || '').toLowerCase();
        Array.from(fontEl.options).forEach(opt => {
            const txt = (opt.textContent || '').toLowerCase();
            opt.hidden = q && !txt.includes(q);
        });
    });
}

const customListEl = document.querySelector('.custom-list');
if (fontSearchEl && customListEl) {
    fontSearchEl.addEventListener('input', (e) => {
        const q = (e.target.value || '').toLowerCase();
        Array.from(customListEl.querySelectorAll('.custom-item')).forEach(it => {
            it.style.display = q && !it.textContent.toLowerCase().includes(q) ? 'none' : '';
        });
    });
}

const fontStatusEl = document.getElementById('fontStatus');
function setFontStatus(state, message) {
    if (!fontStatusEl) return;
    fontStatusEl.innerHTML = '';
    if (state === 'loading') {
        const spinner = document.createElement('span');
        spinner.className = 'spinner';
        fontStatusEl.appendChild(spinner);
        const txt = document.createElement('small'); txt.textContent = message || 'Loading...';
        fontStatusEl.appendChild(txt);
    } else if (state === 'loaded') {
        const txt = document.createElement('small'); txt.textContent = message || 'Loaded';
        fontStatusEl.appendChild(txt);
    } else if (state === 'error') {
        const txt = document.createElement('small'); txt.textContent = message || 'Failed to load';
        fontStatusEl.appendChild(txt);
    } else {
        fontStatusEl.textContent = '';
    }
}

function updatePreview() {
    const raw = textEl.value || '';
    const selected = fontEl.value;
    const size = parseInt(sizeEl.value, 10) || 16;
    const weight = weightEl.value || '400';

    let displayed = raw;
    if (selected && selected.startsWith('fancy-')) displayed = applyTransform(raw, selected);

    const opt = fontEl.selectedOptions && fontEl.selectedOptions[0];
    if (opt && opt.dataset && opt.dataset.google && loadGoogle.checked) {
        loadGoogleFontAsync(opt.dataset.google, (s) => setFontStatus(s === 'loading' ? 'loading' : (s === 'error' ? 'error' : 'loaded'))).catch(() => { });
    }
    const custom = document.getElementById('customGoogle') && document.getElementById('customGoogle').value.trim();
    if (custom && loadGoogle.checked) {
        loadGoogleFontAsync(custom, (s) => setFontStatus(s === 'loading' ? 'loading' : (s === 'error' ? 'error' : 'loaded'))).catch(() => { });
    }

    if (!selected.startsWith('fancy-')) {
        const customVal = document.getElementById('customGoogle') && document.getElementById('customGoogle').value.trim();
        let fontFamily;
        if (selected === 'system') fontFamily = 'system-ui, -apple-system, Segoe UI, Roboto, Helvetica, Arial, sans-serif';
        else fontFamily = selected;
        if (customVal && loadGoogle.checked) {
            fontFamily = customVal.includes(' ') ? `"${customVal}", ${fontFamily}` : `${customVal}, ${fontFamily}`;
        }
        preview.style.fontFamily = fontFamily;
    } else {
        preview.style.fontFamily = '';
    }

    preview.style.fontSize = size + 'px';
    preview.style.fontWeight = weight;
    preview.textContent = displayed;
}

textEl.addEventListener('input', updatePreview);
fontEl.addEventListener('change', updatePreview);
sizeEl.addEventListener('input', updatePreview);
weightEl.addEventListener('change', updatePreview);
loadGoogle.addEventListener('change', updatePreview);

copyBtn.addEventListener('click', async () => {
    try {
        await navigator.clipboard.writeText(preview.textContent || '');
        copyBtn.textContent = 'Copied!';
        setTimeout(() => (copyBtn.textContent = 'Copy Text'), 1200);
    } catch (e) {
        alert('Failed to copy to clipboard');
    }
});

const copyHtmlBtn = document.getElementById('copyHtml');
if (copyHtmlBtn) {
    copyHtmlBtn.addEventListener('click', async () => {
        const html = `<div style="font-family:${preview.style.fontFamily || 'inherit'}; font-size:${preview.style.fontSize || '16px'}; font-weight:${preview.style.fontWeight || '400'}">${escapeHtml(preview.textContent || '')}</div>`;
        try {
            await navigator.clipboard.writeText(html);
            copyHtmlBtn.textContent = 'Copied!';
            setTimeout(() => (copyHtmlBtn.textContent = 'Copy as HTML'), 1200);
        } catch (e) {
            alert('Failed to copy HTML');
        }
    });
}

function escapeHtml(s) {
    return s.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');
}

updatePreview();
