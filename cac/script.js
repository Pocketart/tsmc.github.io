// Elements for dynamic content
const campaignsContainer = document.getElementById('campaigns');
const resultsBody = document.getElementById('results-body');
const totalExpensesElement = document.getElementById('total-expenses');
const totalCustomersElement = document.getElementById('total-customers');
const totalCACElement = document.getElementById('total-cac');

// Initialize campaigns array
let campaigns = [];

// Function to add a new campaign
function addCampaign() {
    const campaignId = campaigns.length;
    campaigns.push({ id: campaignId, name: '', expenses: 0, customers: 0, cac: 0 });

    // Create campaign input group
    const campaignDiv = document.createElement('div');
    campaignDiv.className = 'input-group';
    campaignDiv.id = `campaign-${campaignId}`;
    campaignDiv.innerHTML = `
        <label for="campaign-name-${campaignId}">Campaign Name:</label>
        <input type="text" id="campaign-name-${campaignId}" placeholder="Enter campaign name" oninput="updateCampaign(${campaignId})">
        <label for="expenses-${campaignId}">Marketing Expenses ($):</label>
        <input type="text" id="expenses-${campaignId}" placeholder="Enter expenses" oninput="updateCampaign(${campaignId})">
        <label for="customers-${campaignId}">Customers Acquired:</label>
        <input type="text" id="customers-${campaignId}" placeholder="Enter customers acquired" oninput="updateCampaign(${campaignId})">
        <button onclick="removeCampaign(${campaignId})">Remove Campaign</button>
    `;
    campaignsContainer.appendChild(campaignDiv);
    updateResultsTable();
}

// Function to remove a campaign
function removeCampaign(campaignId) {
    document.getElementById(`campaign-${campaignId}`).remove();
    campaigns = campaigns.filter(campaign => campaign.id !== campaignId);
    updateResultsTable();
}

// Function to update a campaign
function updateCampaign(campaignId) {
    const name = document.getElementById(`campaign-name-${campaignId}`).value;
    const expenses = parseNumber(document.getElementById(`expenses-${campaignId}`).value);
    const customers = parseNumber(document.getElementById(`customers-${campaignId}`).value);
    const cac = customers > 0 ? expenses / customers : 0;

    const campaign = campaigns.find(campaign => campaign.id === campaignId);
    campaign.name = name;
    campaign.expenses = expenses;
    campaign.customers = customers;
    campaign.cac = cac;

    updateResultsTable();
}

// Function to update the results table
function updateResultsTable() {
    // Clear table body
    resultsBody.innerHTML = '';

    let totalExpenses = 0;
    let totalCustomers = 0;
    let totalCAC = 0;

    // Populate table with campaign data
    campaigns.forEach(campaign => {
        totalExpenses += campaign.expenses;
        totalCustomers += campaign.customers;
        const tr = document.createElement('tr');
        tr.innerHTML = `
            <td>${campaign.name}</td>
            <td>${formatNumberWithCommas(campaign.expenses)}</td>
            <td>${campaign.customers}</td>
            <td>${formatNumberWithCommas(campaign.cac)}</td>
        `;
        resultsBody.appendChild(tr);
    });

    // Calculate total CAC
    totalCAC = totalCustomers > 0 ? totalExpenses / totalCustomers : 0;

    // Update totals
    totalExpensesElement.textContent = formatNumberWithCommas(totalExpenses);
    totalCustomersElement.textContent = totalCustomers;
    totalCACElement.textContent = formatNumberWithCommas(totalCAC);
}

// Function to format numbers with commas
function formatNumberWithCommas(number) {
    return number.toLocaleString('en-US', { maximumFractionDigits: 2 });
}

// Function to parse formatted numbers by removing commas
function parseNumber(value) {
    return parseFloat(value.replace(/,/g, '')) || 0;
}

// Add event listener to the "Add Campaign" button
document.getElementById('add-campaign').addEventListener('click', addCampaign);