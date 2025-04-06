"use client";
import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useAuth } from "@/context/AuthProvider";
import NotificationTab from "@/components/common/NotificationTab";
import RoleBasedComponent from "@/components/common/RoleBasedComponent";

const UserHeader = () => {
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

                <Link href="/blog-categories">Blog categories</Link>

                {user ? (
                    <>
                        <Link href="/profile">{user?.fullName}</Link>

                        <RoleBasedComponent
                            allowedRoles={["super_admin", "admin", "moderator"]}
                        >
                            <Link href="/admin">Admin panel</Link>
                        </RoleBasedComponent>

                        <button onClick={logout} className="cursor-pointer">
                            Logout
                        </button>

                        <NotificationTab />
                    </>
                ) : (
                    <Link href="/login">Login</Link>
                )}
            </div>
        </header>
    );
};

export default UserHeader;
