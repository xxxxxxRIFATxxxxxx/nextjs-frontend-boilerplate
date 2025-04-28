"use client";
import Link from "next/link";
import { useAuth } from "@/context/AuthProvider";
import NotificationTab from "@/components/common/NotificationTab";

const AdminHeader = () => {
    const { user, logout } = useAuth();

    return (
        <header>
            <div className="bg-gray-100 p-4 flex items-center justify-center space-x-4 text-center">
                <Link href="/user">Home</Link>

                {user ? (
                    <>
                        <Link href="/admin">Dashboard</Link>

                        <Link href="/admin/users">Users</Link>

                        <Link href="/admin/blogs">Blogs</Link>

                        <Link href="/admin/blog-categories">
                            Blog Categories
                        </Link>

                        <Link href="/admin/files">Files</Link>

                        <Link href="/admin/notifications">Notifications</Link>

                        <Link href="/common/profile">{user?.fullName}</Link>

                        <button onClick={logout} className="cursor-pointer">
                            Logout
                        </button>

                        <NotificationTab />
                    </>
                ) : (
                    <Link href="/common/login">Login</Link>
                )}
            </div>
        </header>
    );
};

export default AdminHeader;
