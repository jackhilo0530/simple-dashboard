//make the first interface showing user lists logged in and click any user then link SocketChat page with the user id as param to show the chat history and send message in real time
import React from 'react';
import { useEffect, useState } from 'react';
import { userApi } from '../services/userService';
// import { Link } from 'react-router-dom';
import { SocketChat } from './SocketChat';
import SearchForm from '../../components/SearchForm';
import type { User } from '../../types';
import { useAuth } from '../../hooks/useAuth';

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || "http://localhost:3000";

export const SocketChats: React.FC = () => {
    const [users, setUsers] = useState<User[]>([]);
    const [selectedUser, setSelectedUser] = useState<User | null>(null);
    const auth = useAuth();
    const token = auth.token;
    const userInfo = token ? JSON.parse(atob(token.split('.')[1])) : null;
    const userEmail = userInfo?.email || "Unknown User";
    const [me, setMe] = useState<User | null>(null);

    useEffect(() => {
        const fetchUsers = async () => {
            try {
                const data = await userApi.list();
                data.forEach((user: User) => {
                    if (user.email === userEmail) {
                        setMe(user);
                    }
                });
                setUsers(data);
            } catch (error) {
                console.error("Failed to fetch users:", error);
            }
        };

        fetchUsers();
    }, [userEmail]);

    return (
        <div className="flex-1 p-10 bg-white">
            <h1 className="text-2xl font-bold mb-6">Chats</h1>
            <div className="rounded-lg bg-white w-full flex border border-gray-200 shadow-sm ">
                <div className="basis-1/4 font-semibold text-gray-500">
                    <div className='px-4 py-3 flex items-center gap-3 sticky top-0 bg-white z-10'>
                        {me && <img src={`${API_BASE_URL}${me.img_url}`} alt="img" width={40} height={40} className="inline-block rounded-full mr-2" />}
                    </div>
                    <div className="mb-4 px-4">
                        <SearchForm placeholder="Search chats..." onSearch={(query) => console.log("Search query:", query)} />
                    </div>
                    <div className={`overflow-y-scroll h-[500px] ${selectedUser ? 'border-b' : ''}`}>
                        {users.map((user) => (
                            <div
                                key={user.id}
                                onClick={() => setSelectedUser(user)}
                                className={`flex cursor-pointer p-4 hover:bg-gray-100 ${selectedUser?.id === user.id ? 'bg-gray-200' : ''
                                    }`}
                            >
                                <img src={`${API_BASE_URL}${user.img_url}`} alt="img" width={40} height={40} className="inline-block rounded-full mr-2" />
                                <div>
                                    <div className="font-bold text-gray-700">{user.username}</div>
                                    <div className="text-xs text-gray-400">{user.email}</div>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
                <div className="basis-3/4 border-l border-gray-200">
                    {selectedUser && (
                        <div className="h-[600px] overflow-y-auto">
                            <div className="flex items-center gap-3 px-4 border-b border-gray-200 py-4 sticky top-0 bg-white z-10">
                                <img src={`${API_BASE_URL}${selectedUser.img_url}`} alt="img" width={40} height={40} className="inline-block rounded-full mr-2" />
                                <div>
                                    <div className="font-bold">{selectedUser.username}</div>
                                    <div className="text-xs text-gray-400">{selectedUser.email}</div>
                                </div>
                            </div>
                            <SocketChat selectedUser={selectedUser} myInfo={me} />
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}
