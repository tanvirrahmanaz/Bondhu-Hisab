'use client';

import { useState } from 'react';

// This component's job is to collect data and tell the parent page when an expense is successfully added.
export default function AdvancedExpenseForm({ groupId, members, onExpenseAdded }) {
    const [description, setDescription] = useState('');
    const [amount, setAmount] = useState('');
    const [paidBy, setPaidBy] = useState(members[0] || '');
    const [splitBetween, setSplitBetween] = useState(members);
    const [isSubmitting, setIsSubmitting] = useState(false);

    const handleCheckboxChange = (member) => {
        setSplitBetween(prev =>
            prev.includes(member)
                ? prev.filter(m => m !== member)
                : [...prev, member]
        );
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!description || !amount || splitBetween.length === 0) {
            alert('Please fill all fields and select at least one member to split with.');
            return;
        }
        setIsSubmitting(true);

        const expenseData = {
            description,
            amount: parseFloat(amount),
            paidBy,
            splitBetween,
        };

        try {
            // The API call to your backend
            const response = await fetch(`http://localhost:5000/api/groups/${groupId}/expenses`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(expenseData),
            });

            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(errorData.message || 'Failed to add expense');
            }

            const updatedGroup = await response.json();
            // This function (from the parent page) updates the entire page with the new data
            onExpenseAdded(updatedGroup);

            // Reset form fields
            setDescription('');
            setAmount('');
            setSplitBetween(members);
        } catch (error) {
            alert(`Error: ${error.message}`);
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <form onSubmit={handleSubmit} className="p-4 bg-white rounded-lg shadow-md mb-8 space-y-4">
            <h2 className="text-xl font-bold">Add New Expense</h2>
            <input
                type="text"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="Expense description"
                className="w-full p-2 border rounded"
                required
            />
            <input
                type="number"
                value={amount}
                onChange={(e) => setAmount(e.target.value)}
                placeholder="Amount"
                className="w-full p-2 border rounded"
                required
            />
            <div>
                <label className="block text-sm font-medium">Paid By</label>
                <select value={paidBy} onChange={(e) => setPaidBy(e.target.value)} className="w-full p-2 border rounded">
                    {members.map(member => <option key={member} value={member}>{member}</option>)}
                </select>
            </div>
            <div>
                <label className="block text-sm font-medium">Split Between</label>
                <div className="grid grid-cols-2 gap-2 p-2 border rounded-md">
                    {members.map(member => (
                        <div key={member} className="flex items-center">
                            <input
                                type="checkbox"
                                id={`member-${member}`}
                                checked={splitBetween.includes(member)}
                                onChange={() => handleCheckboxChange(member)}
                                className="h-4 w-4 rounded"
                            />
                            <label htmlFor={`member-${member}`} className="ml-2 text-sm">{member}</label>
                        </div>
                    ))}
                </div>
            </div>
            <button type="submit" className="w-full bg-blue-600 text-white font-bold p-2 rounded disabled:bg-gray-400" disabled={isSubmitting}>
                {isSubmitting ? 'Adding...' : 'Add Expense'}
            </button>
        </form>
    );
}