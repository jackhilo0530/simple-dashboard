const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || "http://localhost:3000/api";
import React, { useEffect, useState } from 'react';
import SearchForm from '../components/SearchForm';
import Select from '../components/Select';
import { usersApi } from '../services/authService';
import { User } from '../types';


const Users: React.FC = () => {

    const [users, setUsers] = useState<User[]>([]);
    const [loading, setLoading] = useState(false);
    //const [searchQuery, setSearchQuery] = useState('');
    //const [selectedRole, setSelectedRole] = useState('');
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        (async () => {
            try {
                setError(null);
                const usersList = await usersApi.list();
                setUsers(usersList);
            } catch (err) {
                if (err instanceof Error) {
                    setError(err.message);
                } else {
                    setError("Unknown error occurred");
                }
            } finally {
                setLoading(false);
            }
        })();
    }, [loading]);


    const handleSearch = (query: string) => {
        console.log('Search query:', query);
        //setSearchQuery(query);
        // Implement search logic here, e.g., make an API call to fetch filtered users
    }

    const handleSelectChange = (value: string) => {
        console.log('Selected role:', value);
        //setSelectedRole(value);
        // Implement filter logic here, e.g., make an API call to fetch users by role
    }

    const onDelete = async (userId: number) => {
        if(window.confirm("Are you sure you want to delete this user?")) {
            try {
                await usersApi.delete(userId);
                setLoading(true);
            } catch (err) {
                if (err instanceof Error) {
                    setError(err.message);
                } else {
                    setError("Unknown error occurred");
                }
            }
        }
    }

    return (
        <div className='flex-1 p-10 min-h-screen bg-white'>
            <div className='mb-8 flex justify-between gap-4 items-center'>
                <div>
                    <h1 className='text-3xl font-extrabold tracking-tight text-gray-900'>Users</h1>
                </div>

                <div className='flex items-center gap-3 py-4'>
                    <SearchForm onSearch={handleSearch} debounceMs={250} />
                    <Select options={["Admin", "User"]} onChange={handleSelectChange} placeholder='Select Role' />
                </div>
            </div>

            <div className='overflow-hidden rounded-xl border border-gray-200 bg-white shadow-sm'>
                <table className='w-full border-collapse border border-gray-200 text-left'>
                    <thead className='bg-gray-50'>
                        <tr>
                            <th className="border-b border-gray-200 px-6 py-4 text-xs font-bold uppercase tracking-wider text-gray-500">Name</th>
                            <th className="border-b border-gray-200 px-6 py-4 text-xs font-bold uppercase tracking-wider text-gray-500">Email</th>
                            <th className="border-b border-gray-200 px-6 py-4 text-center text-xs font-bold uppercase tracking-wider text-gray-500">Role</th>
                            <th className="border-b border-gray-200 px-6 py-4 text-center text-xs font-bold uppercase tracking-wider text-gray-500">Status</th>
                            <th className="border-b border-gray-200 px-6 py-4 text-center text-xs font-bold uppercase tracking-wider text-gray-500">Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        {loading && <tr><td colSpan={5} className='text-center py-4 text-gray-500'>Loading users...</td></tr>}
                        {error && <tr><td colSpan={5} className='text-center py-4 text-red-500'>{error}</td></tr>}
                        {users.length > 0 ? users.map((user) => (
                            <tr key={user.id} className='hover:bg-gray-50'>
                                <td className="border-b border-gray-200 px-6 py-4">
                                    <div className='flex items-center gap-3'>
                                        <img src={user.img_url ? `${API_BASE_URL}${user.img_url}` : "https://via.placeholder.com/40"} alt={user.username} className='h-12 w-12 rounded-full object-cover' />
                                        <span className='font-medium text-gray-900'>{user.username}</span>
                                    </div>
                                </td>
                                <td className="border-b border-gray-200 px-6 py-4">{user.email}</td>
                                <td className="border-b border-gray-200 px-6 py-4 text-center">
                                    <span className={`inline-flex items-center gap-1 rounded-full px-2 py-1 text-xs font-semibold ${user.role === 'ADMIN' ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}>
                                        {user.role}
                                    </span>
                                </td>
                                <td className="border-b border-gray-200 px-6 py-4 text-center">
                                    <span className={`inline-flex items-center gap-1 rounded-full px-2 py-1 text-xs font-semibold ${user.isActive == true ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}>
                                        {user.isActive == true ? 'Active' : 'Inactive'}
                                    </span>
                                </td>
                                <td className="border-b border-gray-200 px-6 py-4 text-center space-x-2">
                                    <a href="#" className="inline-flex items-center rounded-lg bg-white px-3 py-1.5 text-xs font-semibold text-amber-600 shadow-sm ring-1 ring-inset ring-amber-500 transition-all hover:bg-amber-50">
                                        Edit
                                    </a>

                                    <button onClick={() => onDelete(user.id)} className="inline-flex items-center rounded-lg bg-white px-3 py-1.5 text-xs font-semibold text-red-600 shadow-sm ring-1 ring-inset ring-red-500 transition-all hover:bg-red-50">
                                        Delete
                                    </button>
                                </td>
                            </tr>
                        )) : !loading && <tr><td colSpan={5} className='text-center py-4 text-gray-500'>No users found.</td></tr>}

                    </tbody>

                </table>

            </div>
        </div>
    );
}

export default Users;