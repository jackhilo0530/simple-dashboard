import { NavLink } from "react-router-dom";
import { LayoutDashboard, ShoppingCart } from "lucide-react";

interface NavLinkType {
    name: string,
    path: string,
};

const navLinks: NavLinkType[] = [
    { name: "Dashboard", path: "/" },
    { name: "Products", path: "/products" },
]

export const Navbar = () => {
    return (
        <nav>
            <h2 className='mb-4 text-xs uppercase flex leading-[20px] text-gray-400 justify-start'>Menu</h2>
            <ul className="flex flex-col gap-1">
                {navLinks.map((link) => (
                    <li key={link.name}>
                            <NavLink to={link.path} className="text-gray-700">
                                <button className="menu-item group hover:bg-gray-100 hover:border-none border-gray-100 cursor-pointer justify-start">
                                    <span>
                                        {link.name === "Dashboard" ? <LayoutDashboard size={20} /> : <ShoppingCart size={20} />}
                                    </span>
                                    <span className="translate-x-3">{link.name}</span>
                                </button>
                            </NavLink>
                    </li>
                ))}
            </ul>
        </nav>
    )
}