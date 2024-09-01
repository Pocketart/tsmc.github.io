document.getElementById('add-monthly-cost').addEventListener('click', () => addCostItem('monthly'));
document.getElementById('add-annual-cost').addEventListener('click', () => addCostItem('annual'));

function addCostItem(type) {
    const container = document.getElementById(`${type}-costs`);
    const costItem = document.createElement('div');
    costItem.classList.add('cost-item');
    
    const nameInput = document.createElement('input');
    nameInput.type = 'text';
    nameInput.placeholder = `Enter ${type} item name`;
    nameInput.classList.add(`${type}-name-input`);
    nameInput.addEventListener('input', updateInvoice);

    const costInput = document.createElement('input');
    costInput.type = 'number';
    costInput.placeholder = `Enter ${type} cost`;
    costInput.classList.add(`${type}-input`);
    costInput.addEventListener('input', () => {
        calculateTotalCosts();
        updateInvoice();
    });

    const removeButton = document.createElement('button');
    removeButton.textContent = 'Remove';
    removeButton.addEventListener('click', () => {
        container.removeChild(costItem);
        calculateTotalCosts();
        updateInvoice();
    });

    costItem.appendChild(nameInput);
    costItem.appendChild(costInput);
    costItem.appendChild(removeButton);
    container.appendChild(costItem);
}

function calculateTotalCosts() {
    let totalMonthly = 0;
    let totalAnnual = 0;

    document.querySelectorAll('.monthly-input').forEach(input => {
        totalMonthly += parseFloat(input.value) || 0;
    });

    document.querySelectorAll('.annual-input').forEach(input => {
        totalAnnual += parseFloat(input.value) || 0;
    });

    // Calculate combined costs
    const combinedMonthly = totalMonthly + (totalAnnual / 12);
    const combinedAnnual = totalAnnual + (totalMonthly * 12);

    // Update the displayed totals
    document.getElementById('total-monthly-cost').textContent = `Total Monthly Cost: $${totalMonthly.toFixed(2)}`;
    document.getElementById('total-annual-cost').textContent = `Total Annual Cost: $${totalAnnual.toFixed(2)}`;
    document.getElementById('combined-monthly-cost').textContent = `Combined Monthly Cost: $${combinedMonthly.toFixed(2)}`;
    document.getElementById('combined-annual-cost').textContent = `Combined Annual Cost: $${combinedAnnual.toFixed(2)}`;
}

function updateInvoice() {
    const invoiceEntries = document.getElementById('invoice-entries');
    invoiceEntries.innerHTML = ''; // Clear previous entries

    let totalInvoiceMonthly = 0;
    let totalInvoiceAnnual = 0;

    // Add monthly costs to invoice
    document.querySelectorAll('#monthly-costs .cost-item').forEach(item => {
        const name = item.querySelector('.monthly-name-input').value;
        const cost = parseFloat(item.querySelector('.monthly-input').value) || 0;
        if (name && cost) {
            const row = document.createElement('tr');
            row.innerHTML = `
                <td>Monthly</td>
                <td>${name}</td>
                <td>$${cost.toFixed(2)}</td>
                <td>$${cost.toFixed(2)}</td>
                <td>$${(cost * 12).toFixed(2)}</td>
            `;
            invoiceEntries.appendChild(row);

            // Update total costs
            totalInvoiceMonthly += cost;
            totalInvoiceAnnual += cost * 12;
        }
    });

    // Add annual costs to invoice
    document.querySelectorAll('#annual-costs .cost-item').forEach(item => {
        const name = item.querySelector('.annual-name-input').value;
        const cost = parseFloat(item.querySelector('.annual-input').value) || 0;
        if (name && cost) {
            const row = document.createElement('tr');
            row.innerHTML = `
                <td>Annual</td>
                <td>${name}</td>
                <td>$${cost.toFixed(2)}</td>
                <td>$${(cost / 12).toFixed(2)}</td>
                <td>$${cost.toFixed(2)}</td>
            `;
            invoiceEntries.appendChild(row);

            // Update total costs
            totalInvoiceMonthly += cost / 12;
            totalInvoiceAnnual += cost;
        }
    });

    // Display the total costs in the invoice footer
    document.getElementById('invoice-total-monthly-cost').textContent = `$${totalInvoiceMonthly.toFixed(2)}`;
    document.getElementById('invoice-total-annual-cost').textContent = `$${totalInvoiceAnnual.toFixed(2)}`;
}