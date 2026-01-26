import { useState } from "react";
import { ChevronDown, ChevronUp } from "lucide-react";
import { useAuth } from '../hooks/useAuth';

export const LogoutButton = () => {
    const [open, setOpen] = useState(false);
    const auth = useAuth();
    const handleToggle = () => {
        setOpen((prev) => !prev);
    };

    const onLogout = () => {
        auth?.logout();
    };

    return (
        <div className="relative">
            <button className='flex items-center text-gray-700 dropdown-toggle bg-white' onClick={handleToggle}>
                <span className='mr-3 overflow-hidden rounded-full h-11 w-11'>
                    <img src="../public/images/user/default-avatar.png" alt="user" />
                </span>
                <span className='block mr-1 font-medium text-theme-sm'>Account</span>
                <span className="transition-transform duration-200">
                    {open ? <ChevronUp /> : <ChevronDown />}
                </span>
            </button>
            {open && (
                <div className="absolute left-1/2 -translate-x-1/2 top-15 h-30 w-40 ">
                    <button className=" text-gray-700 bg-white w-full h-30 border-slate-300" onClick={onLogout}>Logout</button>
                </div>
            )}
        </div>
    )
}