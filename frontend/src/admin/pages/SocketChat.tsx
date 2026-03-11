import { useEffect, useState, useRef } from 'react';
// import { useParams } from 'react-router-dom';
import { io, Socket } from 'socket.io-client';
import { SocketChatting } from '../../types';
import { useAuth } from '../../hooks/useAuth';
import type { User } from '../../types';

const SOCKET_URL = 'http://localhost:4000';
const API_URL = '/api/messages';
const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || "http://localhost:3000";

export const SocketChat = ({ selectedUser, myInfo }: { selectedUser: User; myInfo: User | null }) => {

    // const { contactId: contactIdParam } = useParams();
    // const contactId = Number(contactIdParam);


    const [messages, setMessages] = useState<SocketChatting[]>([]);
    const [input, setInput] = useState('');
    const socketRef = useRef<Socket | null>(null);
    const messagesEndRef = useRef<HTMLDivElement | null>(null);


    const auth = useAuth();
    const token = auth.token;
    const userInfo = token ? JSON.parse(atob(token.split('.')[1])) : null;
    const myId = userInfo?.userId;

    const scrollToBottom = () => {
        messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    };

    useEffect(() => {
        scrollToBottom();
    }, [messages]);

    useEffect(() => {
        // 1. Load History from Hono Route
        const loadHistory = async () => {
            const res = await fetch(`${API_URL}/${myId}/${selectedUser.id}`);
            const data = await res.json();
            setMessages(data.reverse()); // Assuming API returns in desc order
        };
        loadHistory();

        // 2. Initialize Socket.io
        socketRef.current = io(SOCKET_URL);

        // Join private room
        socketRef.current.emit('joinRoom', myId);

        // Listen for new messages
        socketRef.current.on('receiveMessage', (newMessage: SocketChatting) => {
            // Only append if it belongs to this conversation
            if (newMessage.user_id === selectedUser.id || newMessage.receiver_id === selectedUser.id) {
                setMessages((prev) => [...prev, newMessage]);
            }
        });

        return () => {

            socketRef.current?.disconnect();
        };
    }, [myId, selectedUser.id]);
    const handleSend = () => {
        if (!input.trim() || !socketRef.current) return;

        socketRef.current.emit('sendMessage', {
            senderId: myId,
            receiverId: selectedUser.id,
            message: input,
        });
        setInput('');
    };

    return (
        <div className="flex flex-col h-full">
            <div className="flex-1 overflow-y-auto p-4">
                {messages.map((msg) => (
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
                ))}
                <div ref={messagesEndRef} />
            </div>
            <div className="flex sticky bottom-0 py-2 bg-white px-2 border-t border-gray-200 space-x-2">
                <input
                    type="text"
                    value={input}
                    onChange={(e) => setInput(e.target.value)}
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