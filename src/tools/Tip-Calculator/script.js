	document.getElementById('calc').addEventListener('click', () => {
		const bill = parseFloat(document.getElementById('bill').value) || 0;
		const tip = parseFloat(document.getElementById('tip').value) || 0;
		const split = parseInt(document.getElementById('split').value) || 1;
		const tipAmt = bill * (tip / 100);
		const total = bill + tipAmt;
		const each = total / split;
		document.getElementById('out').innerHTML = `Tip: $${tipAmt.toFixed(2)}<br>Total: $${total.toFixed(2)}<br>Each: $${each.toFixed(2)}`;
	});
	