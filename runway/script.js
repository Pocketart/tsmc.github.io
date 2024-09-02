const costs = [];
let fundsChart;

document.getElementById('add-cost-btn').addEventListener('click', addCost);
document.getElementById('calculate-btn').addEventListener('click', calculateRunway);

function addCost() {
    const costName = document.getElementById('cost-name').value;
    const costAmount = parseFloat(document.getElementById('cost-amount').value);
    const costType = document.getElementById('cost-type').value;

    if (!costName || isNaN(costAmount)) {
        alert('Please enter a valid name and amount for the cost.');
        return;
    }

    // Add the new cost to the costs array
    costs.push({ name: costName, amount: costAmount, type: costType });

    // Clear input fields
    document.getElementById('cost-name').value = '';
    document.getElementById('cost-amount').value = '';

    // Update the cost list display
    updateCostList();

    // Update the burn rate display
    updateBurnRate();
}

function updateCostList() {
    const costListDiv = document.getElementById('cost-list');
    costListDiv.innerHTML = ''; // Clear the existing list

    costs.forEach(cost => {
        const costDiv = document.createElement('div');
        costDiv.textContent = `${cost.name}: $${cost.amount} (${cost.type})`;
        costListDiv.appendChild(costDiv);
    });
}

function updateBurnRate() {
    let totalMonthlyCost = 0;

    costs.forEach(cost => {
        if (cost.type === 'monthly') {
            totalMonthlyCost += cost.amount;
        } else if (cost.type === 'annual') {
            totalMonthlyCost += cost.amount / 12;
        }
    });

    const totalAnnualCost = totalMonthlyCost * 12;

    // Display the burn rates (these do not consider income)
    document.getElementById('monthly-burn-rate').textContent = totalMonthlyCost.toFixed(2);
    document.getElementById('annual-burn-rate').textContent = totalAnnualCost.toFixed(2);
}

function calculateRunway() {
    const initialCapital = parseFloat(document.getElementById('initial-capital').value);
    const monthlyIncome = parseFloat(document.getElementById('monthly-income').value) || 0;

    if (isNaN(initialCapital)) {
        alert('Please enter a valid initial capital.');
        return;
    }

    let totalMonthlyCost = 0;
    let totalInitialCost = 0;

    costs.forEach(cost => {
        if (cost.type === 'monthly') {
            totalMonthlyCost += cost.amount;
        } else if (cost.type === 'annual') {
            totalMonthlyCost += cost.amount / 12;
        } else if (cost.type === 'down') {
            totalInitialCost += cost.amount;
        }
    });

    const netMonthlyBurnRate = totalMonthlyCost - monthlyIncome; // Income affects runway, not burn rate
    const remainingCapital = initialCapital - totalInitialCost;

    const runwayMonths = remainingCapital / netMonthlyBurnRate;

    if (runwayMonths > 0) {
        document.getElementById('result').textContent = `Your business runway is approximately ${runwayMonths.toFixed(1)} months.`;
    } else {
        document.getElementById('result').textContent = `Your business does not have enough capital to cover the initial costs or monthly expenses.`;
    }

    // Update the burn rate display after calculation
    updateBurnRate();

    // Draw the chart with the calculated data
    drawFundsChart(initialCapital, totalInitialCost, totalMonthlyCost, monthlyIncome);
}

function drawFundsChart(initialCapital, totalInitialCost, totalMonthlyCost, monthlyIncome) {
    const remainingCapital = initialCapital - totalInitialCost;
    const netMonthlyBurnRate = totalMonthlyCost - monthlyIncome;
    const runwayMonths = Math.max(remainingCapital / netMonthlyBurnRate, 0);

    // Prepare data for the chart
    const labels = [];
    const data = [];
    let currentFunds = remainingCapital;
    
    for (let month = 0; month <= Math.ceil(runwayMonths); month++) {
        labels.push(`Month ${month}`);
        data.push(currentFunds.toFixed(2));
        currentFunds -= netMonthlyBurnRate;
    }

    // Remove previous chart instance if it exists
    if (fundsChart) {
        fundsChart.destroy();
    }

    // Get the canvas context for the chart
    const ctx = document.getElementById('fundsChart').getContext('2d');

    // Create a new chart
    fundsChart = new Chart(ctx, {
        type: 'line',
        data: {
            labels: labels,
            datasets: [{
                label: 'Funds Over Time',
                data: data,
                borderColor: 'rgba(75, 192, 192, 1)',
                backgroundColor: 'rgba(75, 192, 192, 0.2)',
                borderWidth: 2,
                fill: true,
                tension: 0.1
            }]
        },
        options: {
            responsive: true,
            scales: {
                x: {
                    title: {
                        display: true,
                        text: 'Time (Months)'
                    }
                },
                y: {
                    title: {
                        display: true,
                        text: 'Funds ($)'
                    },
                    beginAtZero: true
                }
            }
        }
    });
}
