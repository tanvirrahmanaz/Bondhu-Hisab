'use client'; // This must be at the top to use hooks

import { useState } from 'react';
import { useRouter } from 'next/navigation'; // Import for redirection

export default function NewGroupPage() {
    const [groupName, setGroupName] = useState('');
    const [currentMember, setCurrentMember] = useState('');
    const [members, setMembers] = useState([]);
    const [isLoading, setIsLoading] = useState(false); // For loading state
    const router = useRouter(); // Initialize router

    // Function to add a member to the list
    const handleAddMember = () => {
        if (currentMember && !members.includes(currentMember)) {
            setMembers([...members, currentMember]);
            setCurrentMember(''); // Clear the input field
        }
    };

    // Function to handle form submission and API call
    const handleCreateGroup = async (e) => {
        e.preventDefault();
        setIsLoading(true);

        if (!groupName || members.length === 0) {
            alert('Please provide a group name and add at least one member.');
            setIsLoading(false);
            return;
        }

        try {
            const response = await fetch('http://localhost:5000/api/groups', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ groupName, members }),
            });

            if (!response.ok) {
                // If server responds with an error, throw to catch block
                const errorData = await response.json();
                throw new Error(errorData.message || 'Failed to create group');
            }

            const savedGroup = await response.json();
            alert(`Group "${savedGroup.groupName}" created successfully!`);
            
            // Redirect to the newly created group's page
            router.push(`/group/${savedGroup._id}`);

        } catch (error) {
            console.error('Error creating group:', error);
            alert(`An error occurred: ${error.message}`);
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="max-w-2xl mx-auto p-4 md:p-8">
            <h1 className="text-3xl font-bold mb-6 text-center">Create a New Group</h1>
            <form onSubmit={handleCreateGroup} className="space-y-6">
                {/* Group Name Input */}
                <div>
                    <label htmlFor="groupName" className="block text-sm font-medium text-gray-700 mb-1">Group Name</label>
                    <input
                        type="text"
                        id="groupName"
                        value={groupName}
                        onChange={(e) => setGroupName(e.target.value)}
                        className="w-full p-2 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
                        placeholder="e.g., Cox's Bazar Trip"
                        required
                    />
                </div>

                {/* Add Member Input */}
                <div>
                    <label htmlFor="memberName" className="block text-sm font-medium text-gray-700 mb-1">Add Member</label>
                    <div className="flex">
                        <input
                            type="text"
                            id="memberName"
                            value={currentMember}
                            onChange={(e) => setCurrentMember(e.target.value)}
                            className="w-full p-2 border border-gray-300 rounded-l-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
                            placeholder="e.g., Tanveer"
                        />
                        <button type="button" onClick={handleAddMember} className="bg-blue-600 hover:bg-blue-700 text-white font-bold p-2 rounded-r-md">
                            Add
                        </button>
                    </div>
                </div>

                {/* Display Members List */}
                {members.length > 0 && (
                    <div className="p-4 bg-gray-50 rounded-md">
                        <h3 className="font-semibold text-gray-800">Group Members:</h3>
                        <ul className="list-disc pl-5 mt-2 space-y-1 text-gray-600">
                            {members.map((member, index) => (
                                <li key={index}>{member}</li>
                            ))}
                        </ul>
                    </div>
                )}

                {/* Submit Button */}
                <button 
                    type="submit" 
                    className="w-full bg-green-600 hover:bg-green-700 text-white font-bold py-3 px-4 rounded-md disabled:bg-gray-400"
                    disabled={isLoading}
                >
                    {isLoading ? 'Creating...' : 'Create Group & Start Tracking'}
                </button>
            </form>
        </div>
    );
}