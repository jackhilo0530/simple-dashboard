import React from 'react';
import {LogoutButton} from '../components/LogoutButton';

const Header: React.FC = () => {

    return (
        <header className='sticky top-0 flex w-full bg-white border-gray-200 z-99999 border-b'>
            <div className='flex flex-row items-center justify-between grow px-6'>
                <div className='flex items-center justify-end w-full gap-4 px-0 py-4 shadow-none'>

                    <LogoutButton />
                </div>
            </div>
        </header>
    )
}

export default Header;