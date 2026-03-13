import { useEffect, useState, useRef } from 'react';
import { io, Socket } from 'socket.io-client';
import { SocketChatting } from '../../types';
import { useAuth } from '../../hooks/useAuth';
import type { User } from '../../types';

const SOCKET_URL = 'http://localhost:4000';
const API_URL = '/api/messages';
const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || "http://localhost:3000";

export const SocketChat = ({ selectedUser, myInfo }: { selectedUser: User; myInfo: User | null }) => {


    const [messages, setMessages] = useState<SocketChatting[]>([]);
    const [input, setInput] = useState('');
    const socketRef = useRef<Socket | null>(null);
    const messagesEndRef = useRef<HTMLDivElement | null>(null);
    const [hasMore, setHasMore] = useState(true);
    const [page, setPage] = useState(1);
    const scrollContainerRef = useRef<HTMLDivElement | null>(null);
    const [isLoading, setIsLoading] = useState(false);


    const auth = useAuth();
    const token = auth.token;
    const userInfo = token ? JSON.parse(atob(token.split('.')[1])) : null;
    const myId = userInfo?.userId;

    const scrollToBottom = () => {
        messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    };

    useEffect(() => {
        if(hasMore) return;
        scrollToBottom();
    }, [messages, hasMore]);

    useEffect(() => {
        socketRef.current = io(SOCKET_URL);
        socketRef.current.emit('joinRoom', myId);

        if (Notification.permission === "default") {
            Notification.requestPermission();
        }

        return () => {
            socketRef.current?.disconnect();
        };
    }, [myId]);

    useEffect(() => {
        const loadHistory = async () => {
            // Prevent loading if we don't have IDs
            if (!myId || !selectedUser.id) return;

            setIsLoading(true);

            try {
                const res = await fetch(`${API_URL}/${myId}/${selectedUser.id}?page=${page}`);
                const data = await res.json();

                console.log("Loaded history for page", page, data);

                setHasMore(data.length === 10); // Assuming 10 is the page size
                if (data.length > 0) {
                    const scrollContainer = scrollContainerRef.current;
                    const previousHeight = scrollContainer?.scrollHeight || 0;

                    setMessages((prev) => {
                        // CRITICAL: If we are on page 1, we are starting a NEW chat.
                        // Wipe the old messages and just use the new data.
                        if (page === 1) return data;

                        // If page > 1, we are scrolling up, so prepend.
                        return [...data, ...prev];
                    });

                    // Only adjust scroll if we are loading older pages (scrolling up)
                    if (page > 1) {
                        requestAnimationFrame(() => {
                            if (scrollContainer) {
                                scrollContainer.scrollTop = scrollContainer.scrollHeight - previousHeight;
                            }
                        });
                    }
                }
            } catch (error) {
                console.error("Failed to load history", error);
            } finally {
                setIsLoading(false);
            }
        };

        loadHistory();
    }, [myId, selectedUser.id, page]); // page is a dependency here

    // 3. Reset page when user changes
    // This is safe because it's a primitive value and triggers the fetch effect above
    useEffect(() => {
        setPage(1);
    }, [selectedUser.id]);

    useEffect(() => {
        if (!socketRef.current) return;

        // Define the handler so we can remove it later
        const handleReceiveMessage = (newMessage: SocketChatting) => {
            // 1. If the message is from the active chat, update the UI
            if (newMessage.user_id === selectedUser.id) {
                setMessages((prev) => [...prev, newMessage]);
            }

            // 2. Regardless of who it's from, show a notification IF:
            // - It's not from me
            // - I am not looking at that specific chat OR the tab is hidden
            const isFromOther = newMessage.user_id !== myId;
            const isNotActiveChat = newMessage.user_id !== selectedUser.id;
            const isTabHidden = document.visibilityState !== 'visible';

            if (isFromOther && (isNotActiveChat || isTabHidden)) {
                if (Notification.permission === "granted") {
                    const notification = new Notification(`New message from ${newMessage.sender?.username || 'Unknown User'}`, {
                        body: newMessage.message,
                        icon: `${API_BASE_URL}${newMessage.sender?.img_url}`,
                    });
                    notification.onclick = () => {
                        window.focus();

                        //update selected user to the sender of the message and re-render but selectedUser is hook placed in parent component so we need to use custom event to update it
                        const event = new CustomEvent('selectUser', { detail: newMessage.sender });
                        window.dispatchEvent(event);

                        notification.close();
                    };
                }
            }
        };

        socketRef.current.on('receiveMessage', handleReceiveMessage);

        return () => {
            // CLEANUP: Remove the specific listener and disconnect
            socketRef.current?.off('receiveMessage', handleReceiveMessage);
        };
    }, [selectedUser, myId]);


    const handleSend = () => {
        if (!input.trim() || !socketRef.current) return;

        socketRef.current.emit('sendMessage', {
            senderId: myId,
            receiverId: selectedUser.id,
            message: input,
        });
        setMessages((prev) => [...prev, {
            id: Date.now(), // Temporary ID for optimistic UI
            user_id: myId,
            receiver_id: selectedUser.id,
            message: input,
            createdAt: new Date().toISOString(),
            sender: myInfo as User,
        }]);
        setInput('');
    };

    const handleScroll = (e: React.UIEvent<HTMLDivElement>) => {
        const { scrollTop } = e.currentTarget;
        if (scrollTop <= 50 && !isLoading && hasMore) {
            setPage(prev => prev + 1);
        }
    };

    return (
        <div className="flex flex-col h-full">
            <div className="p-4 overflow-y-auto scrollbar-thin h-[500px]" onScroll={handleScroll} ref={scrollContainerRef}>
                {messages.length === 0 && !isLoading ? (
                    <div className="p-8 text-center text-sm text-gray-400">No messages yet. Start the conversation!</div>
                ) : (
                    messages.map((msg) => (
                        <div
                            key={msg.id}
                            className={`flex items-start gap-2 mb-4 max-w-[80%] ${msg.user_id === myId
                                ? "flex-row-reverse self-end ml-auto"
                                : "flex-row self-start mr-auto"
                                }`}
                        >
                            <img
                                src={`${API_BASE_URL}${msg.user_id === myId ? myInfo?.img_url : selectedUser.img_url}`}
                                alt="user"
                                className="w-8 h-8 rounded-full flex-shrink-0 object-cover"
                            />

                            <div className={`flex flex-col ${msg.receiver_id === myId ? "items-end" : "items-start"}`}>
                                <span className="text-[13px] text-gray-400 mt-1">
                                    {(() => {
                                        const now = new Date().getTime();
                                        const createdAt = new Date(msg.createdAt).getTime();
                                        const diff = now - createdAt;

                                        if (diff < 60000) {
                                            return "Just now";
                                        } else if (diff < 3600000) {
                                            return `${Math.floor(diff / 60000)} mins ago`;
                                        } else if (diff < 86400000) {
                                            return `${Math.floor(diff / 3600000)} hours ago`;
                                        } else {
                                            return new Date(msg.createdAt).toLocaleDateString();
                                        }
                                    })()}
                                </span>
                                <div className={`px-3 py-2 rounded-lg shadow-sm ${msg.receiver_id === selectedUser.id
                                    ? "bg-green-200 text-gray-800 rounded-tr-none"
                                    : "bg-gray-100 text-gray-800 rounded-tl-none"
                                    }`}>
                                    <p className="text-sm">{msg.message}</p>
                                </div>

                            </div>
                        </div>
                    ))
                )}
                <div ref={messagesEndRef} />
            </div>
            <div className="flex sticky bottom-0 py-2 bg-white px-2 border-t border-gray-200 space-x-2">
                <input
                    type="text"
                    value={input}
                    onChange={(e) => setInput(e.target.value)}
                    onKeyDown={(e) => e.key === 'Enter' && handleSend()}
                    className=" bg-white flex-1 border rounded-md px-4 focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="Type your message..."
                />
                <button onClick={handleSend} className="bg-blue-500 text-white px-4 rounded-md hover:bg-blue-600">
                    Send
                </button>
            </div>
        </div>
    )
};