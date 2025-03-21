"use client";
import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useAuth } from "@/context/AuthProvider";
import NotificationTab from "@/components/common/NotificationTab";

const Header = () => {
    const router = useRouter();
    const { user, logout } = useAuth();
    const [searchQuery, setSearchQuery] = useState("");

    const handleSearch = (e) => {
        e.preventDefault();
        if (searchQuery.trim()) {
            router.push(
                `/blogs?search=${encodeURIComponent(searchQuery.trim())}`
            );
        }
    };

    return (
        <header>
            {/* search bar */}
            <form onSubmit={handleSearch}>
                <div className="flex items-center justify-center">
                    <input
                        type="search"
                        name="search"
                        id="search"
                        autoComplete="on"
                        className=""
                        placeholder="Search"
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        required
                    />

                    <button type="submit">search</button>
                </div>
            </form>

            <div className="bg-gray-100 p-4 flex items-center justify-center space-x-4 text-center">
                <Link href="/">Home</Link>
                <Link href="/blogs">Blogs</Link>
                {user ? (
                    <button onClick={logout}>Logout</button>
                ) : (
                    <Link href="/login">Login</Link>
                )}
                {user && <Link href="/profile">{user?.fullName}</Link>}
                {user && <NotificationTab />}
            </div>
        </header>
    );
};

export default Header;
