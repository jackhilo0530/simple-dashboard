const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || "http://localhost:3000";
import { useEffect, useState } from "react";
import type { Chat, User } from "../../types";
import { chatsApi } from "../services/chatsService";
import { userApi } from "../services/userService";
import { useAuth } from "../../hooks/useAuth";
import SearchForm from "../../components/SearchForm";

const Charts: React.FC = () => {

    const [chats, setChats] = useState<Chat[]>([]);
    const [error, setError] = useState("");
    const [loading, setLoading] = useState(true);
    const [selectedChat, setSelectedChat] = useState<Chat | null>(null);
    const [isSending, setIsSending] = useState(false);
    const [loggedInUsers, setLoggedInUsers] = useState<User[]>([]);
    const auth = useAuth();
    const token = auth?.token || "";
    //get user info from token
    const userInfo = token ? JSON.parse(atob(token.split(".")[1])) : null;
    // get user id and email from user info
    const userId = userInfo?.userId;
    const userEmail = userInfo?.email;

    const fetchChats = async () => {
        try {
            setError("");
            const data = await chatsApi.list();
            setChats(data);
        } catch (err: any) {
            setError(err.message || "Failed to fetch chats");
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        const fetchLoggedInUsers = async () => {
            try {
                const users = await userApi.list();
                setLoggedInUsers(users);
            } catch (err: any) {
                console.error("Failed to fetch logged in users:", err.message || err);
            }
        };

        fetchLoggedInUsers();

        const interval = setInterval(fetchLoggedInUsers, 5000);

        return () => clearInterval(interval);
    }, []);

    useEffect(() => {

        fetchChats();

        const interval = setInterval(fetchChats, 3000);

        return () => clearInterval(interval);


    }, []);


    if (loading) {
        return <div className="flex-1 p-10 min-h-screen">Loading...</div>;
    }

    if (error) {
        return <div className="flex-1 p-10 min-h-screen text-red-500">Error: {error}</div>;
    }

    const sendMessages = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        const form = e.currentTarget;
        const formData = new FormData(form);
        const message = (formData.get("message") as string)?.trim() || "";
        if (!message || !selectedChat) return;
        setIsSending(true);
        try {
            await chatsApi.create(selectedChat.user_id, message, userId);
            form.reset();
            fetchChats();
        } catch (err: any) {
            alert(err.message || "Failed to send message");
        } finally {
            setIsSending(false);
        }
    };

    return (
        <div className="flex-1 p-10 min-h-screen bg-white">
            <div className="rounded-lg bg-white w-full flex border border-gray-200 shadow-sm">
                <div className="basis-1/4 font-semibold text-gray-500">
                    <div className="p-4 mb-4">{userEmail}</div>
                    <div className="mb-4 px-4">
                        <SearchForm placeholder="Search chats..." onSearch={(query) => console.log("Search query:", query)} />
                    </div>
                    <div className={`overflow-y-auto ${loggedInUsers.length > 5 ? "h-[400px]" : ""}`}>
                        {loggedInUsers.map((user) => (
                            <div
                                key={user.id}
                                className={`p-4 cursor-pointer flex items-center gap-3 ${selectedChat?.user_id === user.id ? "bg-gray-100" : "hover:bg-gray-50"
                                    }`}
                                onClick={() => {
                                    const existingChat = chats.find((chat) => chat.user_id === user.id);
                                    if (existingChat) {
                                        setSelectedChat(existingChat);
                                    } else {
                                        setSelectedChat({
                                            id: 0,
                                            user_id: user.id,
                                            user: user,
                                            receiver_id: userId!,
                                            message: "",
                                            createdAt: new Date().toISOString(),
                                        });
                                    }
                                }}
                            >
                                <img src={`${API_BASE_URL}${user.img_url}`} alt="img" width={40} height={40} className="inline-block rounded-full mr-2" />
                                <div>
                                    <div className="font-bold">{user.username}</div>
                                    <div className="text-xs text-gray-400">{user.email}</div>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
                <div className="border-l border-gray-200 basis-3/4 font-semibold text-gray-500">
                    {selectedChat ? (
                        //use flex-col-reverse to start from bottom and scroll up
                        <div className="px-4 h-[500px] overflow-y-auto">
                            <div className="flex items-center gap-3 border-b border-gray-200 py-4 sticky top-0 bg-white z-10">
                                <img src={`${API_BASE_URL}${selectedChat.user.img_url}`} alt="img" width={40} height={40} className="inline-block rounded-full mr-2" />
                                <div>
                                    <div className="font-bold">{selectedChat.user.username}</div>
                                    <div className="text-xs text-gray-400">{selectedChat.user.email}</div>
                                </div>
                            </div>
                            <div className=" space-y-3 min-h-[400px]">
                                {chats.filter((chat) => chat.user_id === selectedChat.user_id || chat.receiver_id === selectedChat.user_id).map((chat) => (
                                    <div
                                        key={chat.id}
                                        className={`flex items-start gap-2 mb-4 max-w-[80%] ${chat.receiver_id === selectedChat.user_id
                                            ? "flex-row-reverse self-end ml-auto"
                                            : "flex-row self-start mr-auto"
                                            }`}
                                    >
                                        <img
                                            src={`${API_BASE_URL}${chat.user.img_url}`}
                                            alt="user"
                                            className="w-8 h-8 rounded-full flex-shrink-0 object-cover"
                                        />

                                        <div className={`flex flex-col ${chat.receiver_id === selectedChat.user_id ? "items-end" : "items-start"
                                            }`}>
                                            <span className="text-[13px] text-gray-400 mt-1">

                                                {chat.user.username},{" "}
                                                {(() => {
                                                    const now = new Date().getTime();
                                                    const createdAt = new Date(chat.createdAt).getTime();
                                                    const diff = now - createdAt;

                                                    if (diff < 60000) {
                                                        return "Just now";
                                                    } else if (diff < 3600000) {
                                                        return `${Math.floor(diff / 60000)} mins ago`;
                                                    } else if (diff < 86400000) {
                                                        return `${Math.floor(diff / 3600000)} hours ago`;
                                                    } else {
                                                        return new Date(chat.createdAt).toLocaleDateString();
                                                    }
                                                })()}
                                            </span>
                                            <div className={`px-3 py-2 rounded-lg shadow-sm ${chat.receiver_id === selectedChat.user_id
                                                ? "bg-green-200 text-gray-800 rounded-tr-none"
                                                : "bg-gray-100 text-gray-800 rounded-tl-none"
                                                }`}>
                                                <p className="text-sm">{chat.message}</p>
                                            </div>

                                        </div>
                                    </div>
                                ))}
                            </div>
                            <div className="border-t border-gray-200 p-4 pb-0 bg-white sticky bottom-0">
                                <form onSubmit={sendMessages} className="flex items-center gap-2">
                                    <input
                                        name="message"
                                        type="text"
                                        autoComplete="off" // Prevents annoying browser autocomplete boxes
                                        placeholder="Type your message..."
                                        className="bg-white flex-1 rounded-lg border px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/20 text-gray-800 border-gray-300 disabled:bg-gray-50"
                                        disabled={isSending} // Add this state to your component
                                        required
                                    />
                                    <button
                                        type="submit"
                                        disabled={isSending || !selectedChat}
                                        className="inline-flex items-center rounded-lg bg-blue-600 px-4 py-2 text-sm font-semibold text-white transition-all hover:bg-blue-700 disabled:bg-gray-400 disabled:cursor-not-allowed"
                                    >
                                        {isSending ? "..." : "Send"}
                                    </button>
                                </form>
                            </div>
                        </div>
                    ) : (
                        <div className="flex items-center justify-center h-full text-gray-400">
                            Select a chat to view messages
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default Charts;