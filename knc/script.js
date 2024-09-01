// script.js

function convertNumber() {
    const jo = parseFloat(document.getElementById('joInput').value) || 0;
    const eok = parseFloat(document.getElementById('eokInput').value) || 0;
    const man = parseFloat(document.getElementById('manInput').value) || 0;
    const exchangeRate = parseFloat(document.getElementById('exchangeRateInput').value);

    if (isNaN(exchangeRate) || exchangeRate <= 0) {
        alert('Please enter a valid exchange rate.');
        return;
    }

    const joValue = jo * 1000000000000;  // 1 조 = 1 trillion
    const eokValue = eok * 100000000;    // 1 억 = 100 million
    const manValue = man * 10000;        // 1 만 = 10 thousand

    const total = joValue + eokValue + manValue;

    // Update the total output
    document.getElementById('outputNumber').innerText = total.toLocaleString();

    // Calculate formatted output
    const trillions = Math.floor(total / 1000000000000);
    const billions = Math.floor((total % 1000000000000) / 1000000000);
    const millions = Math.floor((total % 1000000000) / 1000000);

    const formattedOutput = `${trillions} trillion ${billions} billion ${millions} million`;
    document.getElementById('formattedOutput').innerText = formattedOutput;

    // Convert KRW to USD using the user-provided exchange rate
    const usdValue = total * exchangeRate;

    // Update the USD output with two decimal places
    document.getElementById('usdOutput').innerText = usdValue.toLocaleString(undefined, {
        style: 'currency',
        currency: 'USD',
        minimumFractionDigits: 2,
        maximumFractionDigits: 2
    });
}