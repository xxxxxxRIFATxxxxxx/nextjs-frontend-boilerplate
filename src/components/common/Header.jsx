"use client";
import { useEffect, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Menu, Search, X } from "lucide-react";
import { useAuth } from "@/context/AuthProvider";
import fetchData from "@/helpers/fetchData";
import Logo from "@/components/common/Logo";
import ProfileButton from "./ProfileButton";

const Header = () => {
    const router = useRouter();
    const { user } = useAuth();

    const [searchQuery, setSearchQuery] = useState("");
    const [openDropdown, setOpenDropdown] = useState(null);
    const [isOpen, setIsOpen] = useState(false);

    const [menuItems, setMenuItems] = useState([
        { id: 1, name: "Home", link: "/" },
        { id: 2, name: "About us", link: "/about" },
        {
            id: 3,
            name: "Blog Articles",
            link: "/blogs",
            hasDropdown: true,
            dropdownItems: [],
        },
    ]);

    const handleSearch = (e) => {
        e.preventDefault();
        if (searchQuery.trim()) {
            router.push(
                `/blogs?search=${encodeURIComponent(searchQuery.trim())}`
            );
        }
    };

    const toggleMenu = () => {
        setIsOpen(!isOpen);
    };

    const toggleDropdown = (id) => {
        setOpenDropdown(openDropdown === id ? null : id);
    };

    useEffect(() => {
        const fetchBlogCategories = async () => {
            const blogCategoriesResponse = await fetchData(
                `${process.env.NEXT_PUBLIC_API_URL}/api/blogCategories`
            );

            setMenuItems((prev) =>
                prev.map((item) =>
                    item.id === 3
                        ? {
                              ...item,
                              dropdownItems: [
                                  {
                                      id: "all-blogs",
                                      name: "All Blogs",
                                      link: "/blogs",
                                  },
                                  ...(blogCategoriesResponse?.data
                                      ? blogCategoriesResponse.data.map(
                                            (cat) => ({
                                                id: cat._id,
                                                name: cat.name,
                                                link: `/blogs?category=${cat.name}`,
                                            })
                                        )
                                      : [
                                            {
                                                id: "error",
                                                name:
                                                    blogCategoriesResponse?.error ||
                                                    "Error",
                                                link: `#`,
                                            },
                                        ]),
                              ],
                          }
                        : item
                )
            );
        };

        fetchBlogCategories();
    }, []);

    return (
        <header className="sticky top-0 left-0 w-full z-50 bg-color9 shadow-md">
            {/* desktop header */}
            <div className="hidden xl:block">
                <div className="bg-gray-100">
                    <div className="container mx-auto py-4 flex items-center justify-between">
                        <Logo width={50} height={50} />

                        {/* search bar */}
                        <form onSubmit={handleSearch} className="w-1/3">
                            <div className="relative w-full">
                                <input
                                    type="search"
                                    name="search"
                                    id="search"
                                    // className="block p-2.5 pl-[20px] w-full text-color8 bg-color10 rounded-full border border-color11 outline-none focus:ring-2 focus:ring-color4"
                                    autoComplete="on"
                                    className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg outline-none focus:ring-2 focus:ring-black block w-full p-3"
                                    placeholder="Search"
                                    required
                                    value={searchQuery}
                                    onChange={(e) =>
                                        setSearchQuery(e.target.value)
                                    }
                                />

                                <button
                                    type="submit"
                                    className="absolute top-0 end-0 p-3 text-sm font-medium h-full text-white bg-black rounded-r-lg border border-black hover:bg-gray-900 focus:ring-0 focus:outline-none cursor-pointer"
                                >
                                    <Search className="w-4 h-4" />
                                    <span className="sr-only">Search</span>
                                </button>
                            </div>
                        </form>

                        {user ? (
                            <ProfileButton user={user} />
                        ) : (
                            <Link href="/signup">Registration</Link>
                        )}
                    </div>
                </div>

                {/* Navigation */}
                <div className="bg-color5 text-color7 py-4">
                    <nav className="flex items-center justify-center space-x-7">
                        {menuItems.map((item) => (
                            <div key={item.id} className="relative group">
                                {!item.hasDropdown ? (
                                    <Link
                                        href={item.link}
                                        className="hover:underline"
                                    >
                                        <span>{item.name}</span>
                                    </Link>
                                ) : (
                                    <>
                                        <Link
                                            href={item.link}
                                            className="flex items-center gap-2"
                                        >
                                            {item.name}
                                            <svg
                                                className="w-2.5 h-2.5"
                                                xmlns="http://www.w3.org/2000/svg"
                                                fill="none"
                                                viewBox="0 0 10 6"
                                            >
                                                <path
                                                    stroke="currentColor"
                                                    strokeLinecap="round"
                                                    strokeLinejoin="round"
                                                    strokeWidth="2"
                                                    d="m1 1 4 4 4-4"
                                                />
                                            </svg>
                                        </Link>

                                        <div className="absolute left-0 mt-2 w-48 bg-color5 text-color7 shadow-lg opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-300">
                                            <ul className="text-sm">
                                                {item.dropdownItems?.map(
                                                    (dropdown) => (
                                                        <li key={dropdown.id}>
                                                            <Link
                                                                href={
                                                                    dropdown.link
                                                                }
                                                                className="block px-4 py-3 hover:bg-color4"
                                                            >
                                                                <span>
                                                                    {
                                                                        dropdown.name
                                                                    }
                                                                </span>
                                                            </Link>
                                                        </li>
                                                    )
                                                )}
                                            </ul>
                                        </div>
                                    </>
                                )}
                            </div>
                        ))}
                    </nav>
                </div>
            </div>

            {/* Mobile Header */}
            <div className="xl:hidden bg-color9 py-4">
                <div className="container mx-auto flex items-center justify-between px-6">
                    <Logo width={100} height={100} />

                    <div className="flex items-center space-x-4">
                        {user ? (
                            <ProfileButton user={user} />
                        ) : (
                            <Link href="/signup">Registration</Link>
                        )}

                        {/* Hamburger Menu */}
                        <button
                            className="text-color8 focus:outline-none"
                            onClick={toggleMenu}
                        >
                            {isOpen ? <X size={28} /> : <Menu size={28} />}
                        </button>
                    </div>
                </div>

                {/* Mobile Menu Drawer */}
                <div
                    className={`fixed top-0 left-0 w-full h-screen bg-color5 text-color7 shadow-lg z-50 px-4 py-8 transform transition-transform duration-300 ${
                        isOpen ? "translate-x-0" : "-translate-x-full"
                    }`}
                >
                    <div className="flex items-center justify-between mb-8 px-4">
                        <div>
                            <Logo width={150} height={150} />
                        </div>

                        <button onClick={toggleMenu} className="text-color7">
                            <X className="text-color7" size={28} />
                        </button>
                    </div>

                    <nav className="mt-12">
                        <ul className="space-y-4">
                            {menuItems.map((item) => (
                                <li key={item.id}>
                                    {!item.hasDropdown ? (
                                        <Link
                                            href={item.link}
                                            className="block py-2 px-4"
                                            onClick={toggleMenu}
                                        >
                                            <span>{item.name}</span>
                                        </Link>
                                    ) : (
                                        <>
                                            <button
                                                className="flex justify-between w-full py-2 px-4"
                                                onClick={() =>
                                                    toggleDropdown(item.id)
                                                }
                                            >
                                                {item.name}
                                                <span>
                                                    {openDropdown === item.id
                                                        ? "▲"
                                                        : "▼"}
                                                </span>
                                            </button>

                                            {openDropdown === item.id && (
                                                <ul className="pl-6 mt-1">
                                                    {item.dropdownItems?.map(
                                                        (dropdown) => (
                                                            <li
                                                                key={
                                                                    dropdown.id
                                                                }
                                                            >
                                                                <Link
                                                                    href={
                                                                        dropdown.link
                                                                    }
                                                                    className="block py-1 px-4"
                                                                    onClick={
                                                                        toggleMenu
                                                                    }
                                                                >
                                                                    <span>
                                                                        {
                                                                            dropdown.name
                                                                        }
                                                                    </span>
                                                                </Link>
                                                            </li>
                                                        )
                                                    )}
                                                </ul>
                                            )}
                                        </>
                                    )}
                                </li>
                            ))}

                            <li>
                                <Link
                                    href="/login"
                                    className="block py-2 px-4"
                                    onClick={toggleMenu}
                                >
                                    <span>Login</span>
                                </Link>
                            </li>
                        </ul>
                    </nav>
                </div>
            </div>
        </header>
    );
};

export default Header;
