'use client';

import { useState, useMemo } from 'react';

export default function AdvancedExpenseForm({ members, groupId, onSuccess }) {
    // Safety check: Don't render if essential props are missing
    if (!members || members.length === 0) {
        return <div className="p-4 text-center text-gray-500 rounded-lg shadow-md bg-white">Loading form...</div>;
    }

    const [description, setDescription] = useState('');
    const [paidByAmounts, setPaidByAmounts] = useState({});
    const [selectedMembers, setSelectedMembers] = useState(members);
    const [customAmounts, setCustomAmounts] = useState({});
    const [isSubmitting, setIsSubmitting] = useState(false);

    const handlePaidByChange = (member, value) => setPaidByAmounts(prev => ({ ...prev, [member]: parseFloat(value) || 0 }));
    const handleSplitMemberSelect = (member) => setSelectedMembers(prev => prev.includes(member) ? prev.filter(m => m !== member) : [...prev, member]);
    const handleCustomAmountChange = (member, value) => setCustomAmounts(prev => ({ ...prev, [member]: parseFloat(value) || 0 }));

    const totalAmount = useMemo(() => Object.values(paidByAmounts).reduce((sum, amount) => sum + amount, 0), [paidByAmounts]);

    const splitDistribution = useMemo(() => {
        const distribution = {};
        if (totalAmount === 0 || selectedMembers.length === 0) return members.reduce((acc, m) => ({ ...acc, [m]: 0 }), {});
        const customAmountTotal = Object.entries(customAmounts).reduce((sum, [m, amount]) => selectedMembers.includes(m) ? sum + amount : sum, 0);
        const membersWithoutCustom = selectedMembers.filter(m => !customAmounts[m]);
        const remainingAmount = totalAmount - customAmountTotal;
        const equalShare = remainingAmount > 0 && membersWithoutCustom.length > 0 ? remainingAmount / membersWithoutCustom.length : 0;
        
        for (const member of members) {
            if (!selectedMembers.includes(member)) distribution[member] = 0;
            else if (customAmounts[member] > 0) distribution[member] = customAmounts[member];
            else distribution[member] = equalShare;
        }
        return distribution;
    }, [totalAmount, selectedMembers, customAmounts, members]);

    const currentSplitTotal = useMemo(() => Object.values(splitDistribution).reduce((sum, amount) => sum + amount, 0), [splitDistribution]);

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (totalAmount === 0) { alert('Total expense amount cannot be zero.'); return; }
        if (Math.abs(currentSplitTotal - totalAmount) > 0.01) { alert(`Split Total (${currentSplitTotal.toFixed(2)}) must match Total Expense (${totalAmount.toFixed(2)}).`); return; }
        
        setIsSubmitting(true);

        const newExpense = {
            description,
            amount: totalAmount,
            paidBy: Object.entries(paidByAmounts).filter(([,a])=>a>0).map(([m,a])=>({member: m, amount: a})),
            splitBy: Object.entries(splitDistribution).filter(([,a])=>a>0).map(([m,a])=>({member: m, amount: a})),
        };

        try {
            const response = await fetch(`http://localhost:5000/api/groups/${groupId}/expenses`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(newExpense),
            });
            if (!response.ok) throw new Error('Server responded with an error');
            
            alert('Expense added successfully!');
            onSuccess(); // Tell the parent page to refresh its data

            // Reset form
            setDescription('');
            setPaidByAmounts({});
            setCustomAmounts({});

        } catch (error) {
            alert(`Error: ${error.message}`);
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <form onSubmit={handleSubmit} className="p-4 bg-white rounded-lg shadow-md mb-8 space-y-4">
            <h2 className="text-xl font-bold">Add Expense</h2>
            <input type="text" value={description} onChange={(e) => setDescription(e.target.value)} placeholder="Expense description" className="w-full p-2 border rounded" required />
            
            <div>
                 <label className="block text-sm font-medium">Paid By</label>
                 <div className="space-y-2 p-2 border rounded-md">
                     {members.map(member => (
                         <div key={`paidby-${member}`} className="flex justify-between items-center">
                             <label htmlFor={`paidby-${member}`} className="text-sm">{member}</label>
                             <input type="number" step="0.01" id={`paidby-${member}`} value={paidByAmounts[member] || ''} onChange={(e) => handlePaidByChange(member, e.target.value)} placeholder="0.00" className="w-24 p-1 border rounded text-right"/>
                         </div>
                     ))}
                 </div>
                 <div className="mt-2 text-sm font-semibold text-blue-600">Calculated Total Expense: {totalAmount.toFixed(2)} BDT</div>
            </div>

            <div>
                <label className="block text-sm font-medium">Split Between</label>
                <div className="space-y-2 p-2 border rounded-md">
                    {members.map(member => (
                        <div key={`split-${member}`} className="flex justify-between items-center">
                            <div className="flex items-center">
                                <input type="checkbox" id={`select-${member}`} checked={selectedMembers.includes(member)} onChange={() => handleSplitMemberSelect(member)} className="h-4 w-4 rounded"/>
                                <label htmlFor={`select-${member}`} className="ml-2 text-sm">{member}</label>
                            </div>
                            <input type="number" step="0.01" value={splitDistribution[member] > 0 ? splitDistribution[member].toFixed(2) : ''} onChange={(e) => handleCustomAmountChange(member, e.target.value)} placeholder="0.00" className="w-24 p-1 border rounded text-right" disabled={!selectedMembers.includes(member)}/>
                        </div>
                    ))}
                </div>
                <div className={`mt-2 text-sm font-semibold ${Math.abs(currentSplitTotal - totalAmount) > 0.01 ? 'text-red-500' : 'text-green-600'}`}>
                    Split Total: {currentSplitTotal.toFixed(2)} / {totalAmount.toFixed(2)}
                </div>
            </div>

            <button type="submit" className="w-full bg-green-600 hover:bg-green-700 text-white font-bold p-2 rounded disabled:bg-gray-400" disabled={isSubmitting}>
                {isSubmitting ? 'Adding...' : 'Add This Expense'}
            </button>
        </form>
    );
}