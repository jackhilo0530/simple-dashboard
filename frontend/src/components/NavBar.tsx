import { NavLink } from "react-router-dom";

interface NavLinkType {
    name: string,
    path: string,
};

const navLinks: NavLinkType[] = [
    {name: "Dashboard", path: "/"},
    {name: "Products", path: "/products"},
]

export const Navbar = () => {
    return (
        <nav>
            <NavLink to="/" className="font-bold">
                <h2 className='mb-4 text-xs uppercase flex leading-[20px] text-gray-400 justify-start'>Menu</h2>
            </NavLink>
            <ul className="flex flex-col gap-5">
                {navLinks.map((link) =>  (
                    <li key={link.name} className="text-secondary w-full h-10 hover:bg-gray-200">
                        <NavLink to={link.path} className="text-center text-gray-900 hover:text-gray-900">{link.name}</NavLink>
                    </li>
                ))}
            </ul>
        </nav>
    )
}