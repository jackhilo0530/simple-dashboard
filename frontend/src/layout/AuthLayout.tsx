import React from 'react';
import { Outlet } from 'react-router';

const AuthLayout: React.FC = () => {
    return (
        <div className='relative p-6 bg-white z-1 sm:p-0'>
            <div className='relative flex flex-col justify-center w-full h-screen lg:flex-row sm:p-0'>
                <div className='flex flex-col justify-center flex-1 w-full max-w-md mx-auto'>
                    <Outlet />
                </div>
                <div className='items-center hidden w-full h-full lg:w-1/2 bg-brand-950 lg:grid'>
                    <div className='relative flex items-center justify-center z-1'>
                        <div className="absolute right-0 top-0 -z-1 w-full max-w-[250px] xl:max-w-[450px]">
                            <img alt="grid" src="/images/shape/grid-01.svg" />
                        </div>
                        <div className="absolute bottom-0 left-0 -z-1 w-full max-w-[250px] rotate-180 xl:max-w-[450px]">
                            <img alt="grid" src="/images/shape/grid-01.svg" />
                        </div>
                        <div className="flex flex-col items-center max-w-xs">
                            <a className="block mb-4" href="/" data-discover="true">
                                <img width="231" height="48" alt="Logo" src="/images/logo/auth-logo.svg" />
                            </a>
                            <p className="text-center text-gray-400 dark:text-white/60">Free and Open-Source Tailwind CSS Admin Dashboard Template</p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default AuthLayout;