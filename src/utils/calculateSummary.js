// src/utils/calculateSummary.js

export function calculateBalances(members, expenses) {
    // 1. Initialize a balance sheet with all members set to 0.
    const balances = {};
    members.forEach(member => {
        balances[member] = 0;
    });

    // 2. Loop through every expense to calculate credits and debits.
    expenses.forEach(expense => {
        // Handle who paid (credits)
        // For each person who paid, add that amount to their balance.
        if (Array.isArray(expense.paidBy)) {
            expense.paidBy.forEach(payer => {
                if (balances.hasOwnProperty(payer.member)) {
                    balances[payer.member] += payer.amount;
                }
            });
        }

        // Handle who the expense was split among (debits)
        // For each person in the split, subtract their share from their balance.
        if (Array.isArray(expense.splitBy)) {
            expense.splitBy.forEach(splitter => {
                if (balances.hasOwnProperty(splitter.member)) {
                    balances[splitter.member] -= splitter.amount;
                }
            });
        }
    });

    // 3. Separate members into those who are owed money and those who owe money.
    const owedTo = []; // Positive balances
    const owes = [];   // Negative balances

    Object.entries(balances).forEach(([member, balance]) => {
        if (balance > 0.01) { // Use a small tolerance
            owedTo.push({ member, amount: balance });
        } else if (balance < -0.01) {
            owes.push({ member, amount: -balance }); // Store as a positive number
        }
    });
    
    // This is a simplified summary. A full "who pays whom" algorithm is more complex,
    // but this gives us the final balances which is the most important part.
    return { balances, owedTo, owes };
}