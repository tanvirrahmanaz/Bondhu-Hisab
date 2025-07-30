import React from 'react';

const Navbar = () => {
    return (
        <div className='flex justify-between items-center p-4 bg-gray-800 text-white'>
            <h2>Bondhu Hisab</h2>
            <ul className='flex '>
                <li className='mr-6'>Home</li>
                <li className='mr-6'>About</li>
                <li>Hisab</li>
            </ul>
            <div>
                <p>User Profile</p>
            </div>
        </div>
    );
};

export default Navbar;