import React, { useEffect, useState, useRef, useCallback, useMemo } from 'react';
import { userApi } from '../services/userService';
import { SocketChat } from './SocketChat';
import SearchForm from '../../components/SearchForm';
import type { User } from '../../types';
import { useAuth } from '../../hooks/useAuth';

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || "http://localhost:3000";
const PER_PAGE = 8;

export const SocketChats: React.FC = () => {
    const [users, setUsers] = useState<User[]>([]);
    const [selectedUser, setSelectedUser] = useState<User | null>(null);
    const [keyword, setKeyword] = useState("");
    const [page, setPage] = useState(1);
    const [hasMore, setHasMore] = useState(true);
    const [me, setMe] = useState<User | null>(null);
    const [isLoading, setIsLoading] = useState(false); // UI Loader state

    const isFetching = useRef(false);
    const { token } = useAuth(); // Destructure directly

    // 1. Memoized user info parsing to ensure it's stable
    const userEmail = useMemo(() => {
        if (!token) return null;
        try {
            const payload = JSON.parse(atob(token.split('.')[1]));
            return payload.email;
        } catch (e) {
            console.error("Token parse error", e);
            return null;
        }
    }, [token]);

    // 2. Event listener for external selection (notifications)
    useEffect(() => {
        const handleSelectUserEvent = (event: any) => {
            if (event.detail) setSelectedUser(event.detail);
        };
        window.addEventListener('selectUser', handleSelectUserEvent);
        return () => window.removeEventListener('selectUser', handleSelectUserEvent);
    }, []);

    // 3. The Core Fetch Function
    const fetchUsers = useCallback(async (pageNum: number, searchKeyword: string) => {
        if (isFetching.current) return;
        isFetching.current = true;
        setIsLoading(true);
        const startTime = Date.now();

        try {
            const data = await userApi.getUsers(pageNum, searchKeyword, PER_PAGE);

            // Handle current user data ("Me")
            if (!me && userEmail) {
                const foundMe = data.find((u: User) => u.email === userEmail);
                if (foundMe) setMe(foundMe);
            }

            // Filter out current user from the list
            const filteredList = data.filter((u: User) => u.email !== userEmail);

            setHasMore(data.length === PER_PAGE);
            setUsers(prev => {
                if (pageNum === 1) return filteredList;
                const existingIds = new Set(prev.map(u => u.id));
                const uniqueNewOnes = filteredList.filter((u: User) => !existingIds.has(u.id));
                return [...prev, ...uniqueNewOnes];
            });
        } catch (error) {
            console.error("Failed to fetch users:", error);
        } finally {
            const elapsedTime = Date.now() - startTime;
            const minTime = 1500;

            const delay = Math.max(0, minTime - elapsedTime);

            setTimeout(() => {

                isFetching.current = false;
                setIsLoading(false);
            }, delay);

        }
    }, [userEmail, me]);

    // 4. Trigger fetch on page/keyword change
    // This MUST include userEmail to ensure it runs as soon as auth is ready
    useEffect(() => {
        fetchUsers(page, keyword);
    }, [page, keyword, userEmail, fetchUsers]);

    const handleSearch = (query: string) => {
        setKeyword(query);
        setPage(1);
        setHasMore(true);
        // We don't clear users here to prevent jumpy UI; fetchUsers(1, ...) replaces it
    };

    const handleScroll = (e: React.UIEvent<HTMLDivElement>) => {
        const { scrollTop, scrollHeight, clientHeight } = e.currentTarget;
        if (scrollHeight - scrollTop <= clientHeight + 150 && hasMore && !isFetching.current) {

            setPage(prev => prev + 1);
        }
    };

    return (
        <div className="flex-1 p-10 bg-white h-full flex flex-col">
            <h1 className="text-2xl font-bold mb-6 text-gray-800">Messages</h1>
            <div className="flex-1 rounded-xl bg-white flex border border-gray-200 shadow-lg overflow-hidden min-h-[600px]">

                {/* User List Sidebar */}
                <div className="basis-1/4 md:basis-1/4 flex flex-col border-r border-gray-200">
                    <div className='p-4 border-b border-gray-50 flex items-center bg-gray-50/30'>
                        {me && (
                            <div className="flex items-center gap-2">
                                <img src={`${API_BASE_URL}${me.img_url}`} alt="me" className="w-9 h-9 rounded-full object-cover border border-gray-200" />
                                <span className="text-sm font-bold text-gray-700 truncate">{me.username}</span>
                            </div>
                        )}
                    </div>
                    <div className="p-3">
                        <SearchForm placeholder="Search contacts..." onSearch={handleSearch} />
                    </div>

                    <div className="overflow-y-auto scrollbar-thin h-[500px]" onScroll={handleScroll}>
                        {users.length === 0 && !isLoading ? (
                            <div className="p-8 text-center text-sm text-gray-400">No users found.</div>
                        ) : (
                            users.map((user, index) => (
                                <div
                                    key={user.id}
                                    onClick={() => setSelectedUser(user)}
                                    className={`animate-user-in flex items-center p-4 cursor-pointer hover:bg-blue-50 transition-colors ${selectedUser?.id === user.id ? 'bg-blue-50 border-r-4 border-blue-500' : ''
                                        }`}
                                    style={{ animationDelay: `${(index % PER_PAGE) * 0.05}s` }}
                                >
                                    <img src={`${API_BASE_URL}${user.img_url}`} alt={user.username} className="w-11 h-11 rounded-full mr-3 object-cover shadow-sm" />
                                    <div className="overflow-hidden">
                                        <div className="font-semibold text-gray-800 truncate">{user.username}</div>
                                        <div className="text-xs text-gray-500 truncate">{user.email}</div>
                                    </div>
                                </div>
                            ))
                        )}
                        {isLoading && (
                            <div className="flex flex-col items-center justify-center p-6 space-y-2 animate-user-in" style={{ animationDelay: '0.5s', animationFillMode: 'forwards' }}>
                                {/* Modern Spinning Ring */}
                                <div className="w-6 h-6 border-2 border-blue-500 border-t-transparent rounded-full animate-spin"></div>
                                <span className="text-[10px] font-bold text-blue-500 uppercase tracking-widest">
                                    Fetching more...
                                </span>
                            </div>
                        )}
                        {!hasMore && users.length > 0 && (

                            <div className="p-8 text-center">
                                <div className="h-[1px] w-12 bg-gray-200 mx-auto mb-1"></div>
                                <span className="text-[10px] text-gray-400 font-medium uppercase tracking-widest">
                                    End of matches
                                </span>
                            </div>
                        )}
                    </div>
                </div>

                {/* Message View Area */}
                <div className="basis-3/4 md:basis-3/4 flex flex-col bg-gray-50/50">
                    {selectedUser ? (
                        <>
                            <div className="flex items-center gap-3 px-6 py-4 border-b border-gray-200 bg-white shadow-sm">
                                <img src={`${API_BASE_URL}${selectedUser.img_url}`} alt="img" className="w-10 h-10 rounded-full object-cover border border-gray-100" />
                                <div>
                                    <div className="font-bold text-gray-800 leading-tight">{selectedUser.username}</div>
                                    <div className="text-[10px] text-green-500 font-bold uppercase tracking-wider">Active Now</div>
                                </div>
                            </div>
                            <div className="flex-1 overflow-hidden relative">
                                <SocketChat key={selectedUser.id} selectedUser={selectedUser} myInfo={me} />
                            </div>
                        </>
                    ) : (
                        <div className="flex flex-col items-center justify-center h-full text-gray-400 bg-white">
                            <div className="w-20 h-20 bg-gray-50 rounded-full flex items-center justify-center text-3xl mb-4">💬</div>
                            <p className="font-medium">Select a conversation to start</p>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};