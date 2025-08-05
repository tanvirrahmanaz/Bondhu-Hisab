// src/components/BalanceSummary.jsx
'use client';

import { calculateBalances } from "@/utils/calculateSummary";

export default function BalanceSummary({ members, expenses }) {
    // Calculate the balances using our utility function
    const { balances } = calculateBalances(members, expenses);

    // Calculate total expenses
    const totalExpenses = expenses.reduce((sum, expense) => sum + (expense.amount || 0), 0);

    return (
        <div className="p-4 bg-white rounded-lg shadow-md mb-8">
            <h2 className="text-2xl font-bold mb-4">Group Summary</h2>
            <div className="mb-4">
                <p className="text-lg">Total Group Expenses: <span className="font-bold">{totalExpenses.toFixed(2)} BDT</span></p>
            </div>
            
            <h3 className="text-xl font-semibold mb-2">Final Balances</h3>
            <div className="space-y-2">
                {Object.entries(balances).map(([member, balance]) => (
                    <div key={member} className="flex justify-between p-2 rounded-md" style={{ background: balance >= 0 ? '#E6F4EA' : '#FDEBEB' }}>
                        <span className="font-medium">{member}</span>
                        {balance >= 0 ? (
                            <span className="font-bold text-green-700">Gets back {balance.toFixed(2)} BDT</span>
                        ) : (
                            <span className="font-bold text-red-700">Owes {(-balance).toFixed(2)} BDT</span>
                        )}
                    </div>
                ))}
            </div>
        </div>
    );
}