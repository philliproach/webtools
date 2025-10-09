        document.getElementById('fmt').addEventListener('click', () => {
            try {
                const j = JSON.parse(document.getElementById('in').value);
                document.getElementById('out').textContent = JSON.stringify(j, null, 2);
            } catch (e) {
                alert('Invalid JSON: ' + e)
            }
        });
        document.getElementById('min').addEventListener('click', () => {
            try {
                const j = JSON.parse(document.getElementById('in').value);
                document.getElementById('out').textContent = JSON.stringify(j);
            } catch (e) {
                alert('Invalid JSON: ' + e)
            }
        });
        document.getElementById('val').addEventListener('click', () => {
            try {
                JSON.parse(document.getElementById('in').value);
                alert('Valid JSON');
            } catch (e) {
                alert('Invalid JSON: ' + e)
            }
        });
    