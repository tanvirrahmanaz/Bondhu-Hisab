// src/components/Navbar.jsx

import Link from 'next/link';

// No need to import React explicitly in new versions of Next.js/React
// import React from 'react';

const Navbar = () => {
    return (
        <nav className='flex justify-between items-center p-4 bg-gray-800 text-white'>
            {/* Improvement 1: Make the logo a link to the homepage */}
            <Link href="/" className="text-xl font-bold">
                Bondhu Hisab
            </Link>

            <ul className='flex items-center'>
                {/* Improvement 2: Each link should be inside its own <li> tag for correct structure and styling */}
                <li className='mr-6'>
                    <Link href="/" className="hover:text-gray-300">Home</Link>
                </li>
                <li className='mr-6'>
                    <Link href="/about" className="hover:text-gray-300">About</Link>
                </li>
                <li className='mr-6'>
                    <Link href="/groups/new" className="hover:text-gray-300">Create Hisab</Link>
                </li>
            </ul>

            <div>
                {/* We can make this a link to a profile page later */}
                <Link href="/profile" className="hover:text-gray-300">User Profile</Link>
            </div>
        </nav>
    );
};

export default Navbar;