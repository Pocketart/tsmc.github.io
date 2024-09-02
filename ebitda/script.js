// Select input elements
const revenueInput = document.getElementById('revenue');
const operatingExpensesInput = document.getElementById('operating-expenses');
const depreciationInput = document.getElementById('depreciation');
const amortizationInput = document.getElementById('amortization');
const ebitdaOutput = document.getElementById('ebitda');

// Add event listeners for live calculation on all inputs
revenueInput.addEventListener('input', updateEBITDA);
operatingExpensesInput.addEventListener('input', updateEBITDA);
depreciationInput.addEventListener('input', updateEBITDA);
amortizationInput.addEventListener('input', updateEBITDA);

// Function to format numbers with commas
function formatNumberWithCommas(number) {
    return number.toLocaleString('en-US', { maximumFractionDigits: 2 });
}

// Function to parse formatted numbers by removing commas
function parseNumber(value) {
    return parseFloat(value.replace(/,/g, '')) || 0;
}

function updateEBITDA() {
    // Parse input values
    const revenue = parseNumber(revenueInput.value);
    const operatingExpenses = parseNumber(operatingExpensesInput.value);
    const depreciation = parseNumber(depreciationInput.value);
    const amortization = parseNumber(amortizationInput.value);

    // Calculate EBITDA
    const ebitda = revenue - operatingExpenses + depreciation + amortization;

    // Update the output element
    ebitdaOutput.value = formatNumberWithCommas(ebitda);
}