'use client';

import { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';
import AdvancedExpenseForm from '@/components/AdvancedExpenseForm';

export default function GroupDetailsPage() {
    const [group, setGroup] = useState(null); // The single source of truth for all group data
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState('');
    const params = useParams();
    const { id } = params;

    // This effect only runs once to fetch the initial group data
    useEffect(() => {
        if (id) {
            const fetchGroupDetails = async () => {
                try {
                    setIsLoading(true);
                    const response = await fetch(`http://localhost:5000/api/groups/${id}`);
                    if (!response.ok) throw new Error('Failed to fetch group');
                    const data = await response.json();
                    setGroup(data);
                } catch (err) {
                    setError(err.message);
                } finally {
                    setIsLoading(false);
                }
            };
            fetchGroupDetails();
        }
    }, [id]);

    // This function is passed to the form. It updates the page's state
    // when a new expense is successfully added to the database.
    const handleExpenseAdded = (updatedGroupFromServer) => {
        setGroup(updatedGroupFromServer); // Re-render the page with the latest data
    };

    if (isLoading) return <div className="text-center mt-20">Loading...</div>;
    if (error) return <div className="text-center mt-20 text-red-500">Error: {error}</div>;
    if (!group) return <div className="text-center mt-20">Group not found.</div>;

    return (
        <div className="max-w-6xl mx-auto p-4 md:p-8">
            <h1 className="text-4xl font-bold mb-4">{group.groupName}</h1>
            
            <div className="grid md:grid-cols-3 gap-8">
                {/* Left Column: Form and Members */}
                <div className="md:col-span-1 space-y-6">
                    <AdvancedExpenseForm
                        members={group.members}
                        groupId={id}
                        onExpenseAdded={handleExpenseAdded} // Pass the handler function as a prop
                    />
                    {/* Members List */}
                </div>

                {/* Right Column: Expense List */}
                <div className="md:col-span-2">
                    <h2 className="text-2xl font-bold mb-4">Expense List</h2>
                    <div className="space-y-4">
                        {group.expenses && group.expenses.length > 0 ? (
                            // We map over group.expenses, which comes directly from the database
                            group.expenses.slice().reverse().map((expense) => (
                                <div key={expense._id || expense.id} className="p-4 bg-white rounded-lg shadow-md">
                                    <div className="flex justify-between items-center">
                                        <div>
                                            <p className="font-bold text-lg">{expense.description}</p>
                                            <p className="text-sm text-gray-500">Paid by: {expense.paidBy}</p>
                                        </div>
                                        <p className="text-xl font-semibold">{expense.amount} BDT</p>
                                    </div>
                                    <div className="mt-2 text-xs text-gray-600">
                                        Shared between: {expense.splitBetween.join(', ')}
                                    </div>
                                </div>
                            ))
                        ) : (
                            <p className="text-gray-500">No expenses added yet.</p>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
}