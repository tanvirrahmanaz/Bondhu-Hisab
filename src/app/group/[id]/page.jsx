'use client';

import { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';

export default function GroupDetailsPage() {
    const [group, setGroup] = useState(null);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState('');
    const params = useParams(); // Hook to get URL parameters
    const { id } = params; // Get the id from the params object
                    
    useEffect(() => {
        if (id) {
            const fetchGroupDetails = async () => {
                try {
                    setIsLoading(true);
                    const response = await fetch(`http://localhost:5000/api/groups/${id}`);

                    if (!response.ok) {
                        const errorData = await response.json();
                        throw new Error(errorData.message || 'Failed to fetch group details');
                    }

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
    }, [id]); // This effect runs whenever the 'id' changes

    if (isLoading) {
        return <div className="text-center mt-20">Loading group details...</div>;
    }

    if (error) {
        return <div className="text-center mt-20 text-red-500">Error: {error}</div>;
    }

    if (!group) {
        return <div className="text-center mt-20">Group not found.</div>;
    }

    return (
        <div className="max-w-4xl mx-auto p-4 md:p-8">
            <h1 className="text-4xl font-bold mb-2">{group.groupName}</h1>
            
            <div className="p-4 bg-gray-900 rounded-md">
                <h2 className="text-xl font-semibold mb-3">Members</h2>
                <ul className="flex flex-wrap gap-4">
                    {group.members.map((member, index) => (
                        <li key={index} className="bg-blue-100 text-blue-800 px-3 py-1 rounded-full">
                            {member}
                        </li>
                    ))}
                </ul>
            </div>

            {/* You will add the "Add Expense" form and "Expense List" here in the next steps */}
            <div className="mt-8">
                <h2 className="text-2xl font-bold">Expenses</h2>
                <p className="mt-4 text-gray-500">Your expense tracking section will go here...</p>
            </div>
        </div>
    );
}