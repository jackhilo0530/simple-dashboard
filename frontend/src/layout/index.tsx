import React from 'react';
import { Outlet } from 'react-router';
import Header from './Header';
import Sidebar from './Sidebar';
import Footer from './Footer';

const MainLayout: React.FC = () => {
    return (
        <>
            <Sidebar />
            <div className='flex-1 bg-gray-100 transition-all duration-300 ease-in-out ml-[290px]'>
                <Header />
                <Outlet />
                <Footer />
            </div>
        </>
    )
}

export default MainLayout;