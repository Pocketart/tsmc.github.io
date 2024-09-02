// Elements for dynamic content
const investmentsContainer = document.getElementById('investments');
const resultsBody = document.getElementById('results-body');
const totalPostMoneyElement = document.getElementById('total-post-money');
const totalNewInvestorElement = document.getElementById('total-new-investor');
const totalFounderElement = document.getElementById('total-founder');
const totalInvestorElement = document.getElementById('total-investor');

// Initialize investment array
let investments = [];

// Function to add a new investment
function addInvestment() {
    const investmentId = investments.length;
    investments.push({ id: investmentId, amount: 0, preMoneyValuation: 0 });

    // Create investment input group
    const investmentDiv = document.createElement('div');
    investmentDiv.className = 'input-group';
    investmentDiv.id = `investment-${investmentId}`;
    investmentDiv.innerHTML = `
        <label for="investment-amount-${investmentId}">Investment Amount ($):</label>
        <input type="text" id="investment-amount-${investmentId}" placeholder="Enter amount" oninput="updateInvestment(${investmentId})">
        <br> <!-- Line break to ensure proper formatting -->
        <label for="pre-money-valuation-${investmentId}">Pre-Money Valuation ($):</label>
        <input type="text" id="pre-money-valuation-${investmentId}" placeholder="Enter valuation" oninput="updateInvestment(${investmentId})">
        <button onclick="removeInvestment(${investmentId})">Remove Investment</button>
    `;
    investmentsContainer.appendChild(investmentDiv);
    updateResultsTable();
}

// Function to remove an investment
function removeInvestment(investmentId) {
    document.getElementById(`investment-${investmentId}`).remove();
    investments = investments.filter(investment => investment.id !== investmentId);
    updateResultsTable();
}

// Function to update an investment
function updateInvestment(investmentId) {
    const amount = parseNumber(document.getElementById(`investment-amount-${investmentId}`).value);
    const preMoneyValuation = parseNumber(document.getElementById(`pre-money-valuation-${investmentId}`).value);

    const investment = investments.find(investment => investment.id === investmentId);
    investment.amount = amount;
    investment.preMoneyValuation = preMoneyValuation;

    updateResultsTable();
}

// Function to update the results table
function updateResultsTable() {
    // Clear table body
    resultsBody.innerHTML = '';

    // Parse initial ownership values
    const initialFounderOwnership = parseNumber(document.getElementById('founder-ownership').value);
    const initialInvestorOwnership = parseNumber(document.getElementById('investor-ownership').value);

    let totalPostMoney = 0;
    let totalNewInvestorOwnership = 0;
    let finalFounderOwnership = initialFounderOwnership;
    let finalInvestorOwnership = initialInvestorOwnership;

    // Populate table with investment data
    investments.forEach(investment => {
        const postMoneyValuation = investment.preMoneyValuation + investment.amount;
        const newInvestorOwnership = (investment.amount / postMoneyValuation) * 100;
        finalFounderOwnership *= (investment.preMoneyValuation / postMoneyValuation);
        finalInvestorOwnership *= (investment.preMoneyValuation / postMoneyValuation);

        totalPostMoney += postMoneyValuation;
        totalNewInvestorOwnership += newInvestorOwnership;

        const tr = document.createElement('tr');
        tr.innerHTML = `
            <td>${formatNumberWithCommas(investment.amount)}</td>
            <td>${formatNumberWithCommas(investment.preMoneyValuation)}</td>
            <td>${formatNumberWithCommas(postMoneyValuation)}</td>
            <td>${newInvestorOwnership.toFixed(2)}</td>
            <td>${(finalFounderOwnership).toFixed(2)}</td>
            <td>${(finalInvestorOwnership).toFixed(2)}</td>
        `;
        resultsBody.appendChild(tr);
    });

    // Calculate total post-money valuation and final ownership percentages
    totalPostMoney = investments.reduce((acc, inv) => acc + inv.preMoneyValuation + inv.amount, 0);
    const totalEquity = finalFounderOwnership + finalInvestorOwnership + totalNewInvestorOwnership;

    totalFounderElement.textContent = (finalFounderOwnership / totalEquity * 100).toFixed(2);
    totalInvestorElement.textContent = (finalInvestorOwnership / totalEquity * 100).toFixed(2);
    totalNewInvestorElement.textContent = (totalNewInvestorOwnership / totalEquity * 100).toFixed(2);
    totalPostMoneyElement.textContent = formatNumberWithCommas(totalPostMoney);
}

// Function to format numbers with commas
function formatNumberWithCommas(number) {
    return number.toLocaleString('en-US', { maximumFractionDigits: 2 });
}

// Function to parse formatted numbers by removing commas
function parseNumber(value) {
    return parseFloat(value.replace(/,/g, '')) || 0;
}

// Add event listener to the "Add Investment" button
document.getElementById('add-investment').addEventListener('click', addInvestment);