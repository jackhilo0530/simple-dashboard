import { LayoutDashboard, ShoppingCart, Users, University, ListOrdered, Motorbike, MessageSquareText, MessageSquareMore } from "lucide-react";
import { NavLink } from "react-router-dom";

interface NavLinkType {
    name: string,
    path: string,
    icon: React.ReactElement
};

const navLinks: NavLinkType[] = [
    { name: "Dashboard", path: "/admin", icon: <LayoutDashboard size={20} /> },
    { name: "DummyProducts", path: "/admin/dummyProducts", icon: <ShoppingCart size={20} /> },
    { name: "Products", path: "/admin/products", icon: <University size={20} /> },
    { name: "Orders", path: "/admin/orders", icon: <ListOrdered size={20} /> },
    { name: "Shipments", path: "/admin/shipments", icon: <Motorbike size={20} /> },
    { name: "Users", path: "/users", icon: <Users size={20} /> },
    { name: "Chats", path: "/admin/chats", icon: <MessageSquareText size={20} /> },
    { name: "SocketChats", path: "/admin/socketChats", icon: <MessageSquareMore size={20} /> },
]

export const Navbar = () => {
    return (
        <nav>
            <h2 className='mb-4 text-xs uppercase flex leading-[20px] text-gray-400 justify-start'>Menu</h2>
            <ul className="flex flex-col gap-1">
                {navLinks.map((link) => (
                    <li key={link.name}>
                        <NavLink type="button" to={link.path} className="menu-item group hover:bg-gray-100 hover:border-none border-gray-100 cursor-pointer justify-start text-gray-700">
                            <span>
                                {link.icon}
                            </span>
                            <span className="translate-x-3">{link.name}</span>
                        </NavLink>
                    </li>
                ))}
            </ul>
        </nav>
    )
}