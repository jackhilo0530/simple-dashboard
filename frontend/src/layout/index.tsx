import React from 'react';
import { useEffect } from 'react';
import { Outlet } from 'react-router';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';
import Header from './Header';
import Sidebar from './Sidebar';
import Footer from './Footer';

const MainLayout: React.FC = () => {
    const navigate = useNavigate();
    const auth = useAuth();

    console.log(auth);

    useEffect(() => {
        if(auth?.token === "") {
            navigate("/auth/signin");
        }
    });

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