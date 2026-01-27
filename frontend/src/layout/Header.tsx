import React from 'react';
import {LogoutButton} from '../components/LogoutButton';

const Header: React.FC = () => {

    return (
        <header className='sticky top-0 flex w-full bg-white border-gray-200 z-99999 border-b'>
            <div className='flex flex-row items-center justify-end grow px-6'>
                <LogoutButton />
            </div>
        </header>
    )
}

export default Header;