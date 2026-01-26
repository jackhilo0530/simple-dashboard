import React from 'react';
import { Navbar } from '../components/NavBar';

const Sidebar: React.FC = () => {
    return (
        <aside className='fixed flex-col top-0 px-5 left-0 bg-white text-gray-900 h-screen transition-all duration-300 ease-in-out z-50 border-r border-gray-200 w-[290px] -translate-x-0'>
            <div className='py-8 flex justify-start'>
                <a href="/" data-discover="true">
                    <img src="../public/images/logo/auth-logo-dark.png" width="150" height="40"  alt="Logo" />
                </a>
            </div>
            <div className='flex flex-col overflow-y-auto duration-300 ease-liner no-scrollbar'>
                <Navbar />
            </div>
        </aside>
    )
}

export default Sidebar;