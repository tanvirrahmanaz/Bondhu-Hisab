'use client';

import { useEffect, useState, useCallback } from 'react';
import { useParams } from 'next/navigation';
import AdvancedExpenseForm from '@/components/AdvancedExpenseForm';
import BalanceSummary from '@/components/BalanceSummary';

export default function GroupDetailsPage() {
    const [group, setGroup] = useState(null);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState('');
    const params = useParams();
    const { id } = params;

    // We put the fetch logic in its own function so we can call it again.
    // useCallback prevents it from being recreated on every render.
    const fetchGroupDetails = useCallback(async () => {
        try {
            setIsLoading(true);
            const response = await fetch(`http://localhost:5000/api/groups/${id}`);
            if (!response.ok) throw new Error('Failed to fetch group details');
            const data = await response.json();
            setGroup(data);
        } catch (err) {
            setError(err.message);
        } finally {
            setIsLoading(false);
        }
    }, [id]);

    // This effect runs once when the page loads to get the initial data.
    useEffect(() => {
        if (id) {
            fetchGroupDetails();
        }
    }, [id, fetchGroupDetails]);

    // Loading, Error, and Not Found states
    if (isLoading) return <div className="text-center mt-20">Loading...</div>;
    if (error) return <div className="text-center mt-20 text-red-500">Error: {error}</div>;
    if (!group) return <div className="text-center mt-20">Group not found.</div>;

    // Main component render
    return (
        <div className="max-w-6xl mx-auto p-4 md:p-8">
            <h1 className="text-4xl font-bold mb-4">{group.groupName}</h1>
            
            <div className="grid md:grid-cols-3 gap-8">
                {/* --- LEFT COLUMN --- */}
                <div className="md:col-span-1 space-y-6">
                    <AdvancedExpenseForm
                        members={group.members}
                        groupId={id}
                        onSuccess={fetchGroupDetails} // Pass the fetch function as the success callback
                    />
                    <div className="p-4 bg-gray-100 rounded-lg">
                        <h2 className="text-xl font-semibold mb-3">Members</h2>
                        <ul className="space-y-2">
                            {group.members.map((member, index) => (
                                <li key={index} className="bg-blue-100 text-blue-800 px-3 py-1 rounded-full text-center">
                                    {member}
                                </li>
                            ))}
                        </ul>
                    </div>
                </div>

                {/* --- RIGHT COLUMN --- */}
                <div className="md:col-span-2">
                    {group.expenses && group.expenses.length > 0 && (
                        <BalanceSummary members={group.members} expenses={group.expenses} />
                    )}
                    <h2 className="text-2xl font-bold mb-4 mt-8">Expense List</h2>
                    <div className="space-y-4">
                        {group.expenses?.slice().reverse().map((expense) => (
                            <div key={expense._id} className="p-4 bg-white rounded-lg shadow-md">
                                <div className="flex justify-between items-center">
                                    <p className="font-bold text-lg">{expense.description}</p>
                                    <p className="text-xl font-semibold">{(expense.amount || 0).toFixed(2)} BDT</p>
                                </div>
                                <div className="mt-2 text-xs text-gray-600 border-t pt-2">
                                    <p><strong>Paid by:</strong> {Array.isArray(expense.paidBy) ? expense.paidBy.map(p => `${p.member} (${(p.amount || 0).toFixed(2)})`).join(', ') : expense.paidBy}</p>
                                    <p className="mt-1"><strong>Split Details:</strong> {Array.isArray(expense.splitBy) ? expense.splitBy.map(s => `${s.member} (${(s.amount || 0).toFixed(2)})`).join(', ') : 'N/A'}</p>
                                </div>
                            </div>
                        ))}
                        {(!group.expenses || group.expenses.length === 0) && (
                           <p className="text-gray-500">No expenses added yet. Please add an expense using the form on the left.</p> 
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
}