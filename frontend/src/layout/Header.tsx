import React from 'react';
import { ChevronDown} from 'lucide-react';

const Header: React.FC = () => {

    return (
        <header className='sticky top-0 flex w-full bg-white border-gray-200 z-99999 border-b'>
            <div className='flex flex-row items-center justify-between grow px-6'>
                <div className='flex items-center justify-end w-full gap-4 px-0 py-4 shadow-none'>
                    
                    <div className='relative'>
                        <button className='flex items-center text-gray-700 dropdown-toggle bg-white'>
                            <span className='mr-3 overflow-hidden rounded-full h-11 w-11'>
                                <img src="../public/images/user/image.png" alt="user" />
                            </span>
                            <span className='block mr-1 font-medium text-theme-sm'>Account</span>
                            <ChevronDown className="transition-transform duration-200" />
                        </button>
                    </div>
                </div>
            </div>
        </header>
    )
}

export default Header;