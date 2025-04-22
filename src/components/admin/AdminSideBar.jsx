"use client";
import Link from "next/link";
import { useAuth } from "@/context/AuthProvider";
import NotificationTab from "@/components/common/NotificationTab";

const AdminSideBar = () => {
    const { user, logout } = useAuth();

    return (
        <aside>
            <div className="bg-gray-100 p-4 space-y-4 flex flex-col">
                <Link href="/">Home</Link>

                {user ? (
                    <>
                        <Link href="/admin">Dashboard</Link>

                        <Link href="/admin/users">Users</Link>

                        <Link href="/admin/blogs">Blogs</Link>

                        <Link href="/admin/blog-categories">
                            Blog categories
                        </Link>

                        <Link href="/admin/files">Files</Link>

                        <Link href="/admin/notifications">Notifications</Link>

                        <button onClick={logout} className="cursor-pointer">
                            Logout
                        </button>

                        <Link href="/profile">{user?.fullName}</Link>

                        <NotificationTab />
                    </>
                ) : (
                    <Link href="/login">Login</Link>
                )}
            </div>
        </aside>
    );
};

export default AdminSideBar;
