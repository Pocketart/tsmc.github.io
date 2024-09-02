// Select input elements
const investmentAmountInput = document.getElementById('investment-amount');
const equityPercentageInput = document.getElementById('equity-percentage');
const preMoneyValuationInput = document.getElementById('pre-money-valuation');
const postMoneyValuationInput = document.getElementById('post-money-valuation');

// Initialize Chart.js chart
let equityChart = null;
initializeChart();

// Add event listeners for live calculation on all inputs
investmentAmountInput.addEventListener('input', () => formatAndCalculate(investmentAmountInput, updateFromInvestmentAndEquity));
equityPercentageInput.addEventListener('input', () => formatAndCalculate(equityPercentageInput, updateFromInvestmentAndEquity));
preMoneyValuationInput.addEventListener('input', () => formatAndCalculate(preMoneyValuationInput, updateFromPreMoney));
postMoneyValuationInput.addEventListener('input', () => formatAndCalculate(postMoneyValuationInput, updateFromPostMoney));

// Function to format input values with commas and perform calculations
function formatAndCalculate(inputElement, updateFunction) {
    const value = parseNumber(inputElement.value);
    inputElement.value = formatNumberWithCommas(value);
    updateFunction();
}

// Function to format a number with commas
function formatNumberWithCommas(number) {
    if (isNaN(number)) return '';
    return number.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',');
}

// Function to parse a formatted number by removing commas
function parseNumber(value) {
    return parseFloat(value.replace(/,/g, '')) || 0;
}

function updateFromInvestmentAndEquity() {
    // Get input values without commas
    const investmentAmount = parseNumber(investmentAmountInput.value);
    const equityPercentage = parseNumber(equityPercentageInput.value);

    if (equityPercentage === 0) {
        preMoneyValuationInput.value = '0';
        postMoneyValuationInput.value = formatNumberWithCommas(investmentAmount);
        updateChart(0, 100); // Assume 100% existing equity when equity is 0
        return;
    }

    // Calculate post-money valuation
    const postMoneyValuation = investmentAmount / (equityPercentage / 100);

    // Calculate pre-money valuation
    const preMoneyValuation = postMoneyValuation - investmentAmount;

    // Update the output elements
    preMoneyValuationInput.value = formatNumberWithCommas(preMoneyValuation.toFixed(2));
    postMoneyValuationInput.value = formatNumberWithCommas(postMoneyValuation.toFixed(2));

    // Update the chart
    updateChart(equityPercentage, 100 - equityPercentage);
}

function updateFromPreMoney() {
    // Get input values without commas
    const preMoneyValuation = parseNumber(preMoneyValuationInput.value);
    const investmentAmount = parseNumber(investmentAmountInput.value);

    // Calculate post-money valuation
    const postMoneyValuation = preMoneyValuation + investmentAmount;

    // Calculate equity percentage
    const equityPercentage = (investmentAmount / postMoneyValuation) * 100;

    // Update the output elements
    postMoneyValuationInput.value = formatNumberWithCommas(postMoneyValuation.toFixed(2));
    equityPercentageInput.value = equityPercentage.toFixed(2);

    // Update the chart
    updateChart(equityPercentage, 100 - equityPercentage);
}

function updateFromPostMoney() {
    // Get input values without commas
    const postMoneyValuation = parseNumber(postMoneyValuationInput.value);
    const investmentAmount = parseNumber(investmentAmountInput.value);

    // Calculate pre-money valuation
    const preMoneyValuation = postMoneyValuation - investmentAmount;

    // Calculate equity percentage
    const equityPercentage = (investmentAmount / postMoneyValuation) * 100;

    // Update the output elements
    preMoneyValuationInput.value = formatNumberWithCommas(preMoneyValuation.toFixed(2));
    equityPercentageInput.value = equityPercentage.toFixed(2);

    // Update the chart
    updateChart(equityPercentage, 100 - equityPercentage);
}

// Initialize the Chart.js pie chart
function initializeChart() {
    const ctx = document.getElementById('equityChart').getContext('2d');
    equityChart = new Chart(ctx, {
        type: 'pie',
        data: {
            labels: ['Investor Equity', 'Existing Equity'],
            datasets: [{
                data: [0, 100], // Initial dummy data
                backgroundColor: ['#FF6384', '#36A2EB'],
                hoverOffset: 4
            }]
        },
        options: {
            responsive: true,
            plugins: {
                legend: {
                    position: 'bottom',
                }
            }
        }
    });
}

// Update the chart with new equity percentages
function updateChart(investorEquity, existingEquity) {
    equityChart.data.datasets[0].data = [investorEquity, existingEquity];
    equityChart.update();
}