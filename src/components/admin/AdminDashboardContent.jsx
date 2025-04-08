"use client";
import { useEffect, useState } from "react";
import { toast } from "react-toastify";
import { useSocket } from "@/context/SocketProvider";
import fetchDataForClient from "@/helpers/fetchDataForClient";

const AdminDashboardContent = ({
    initialUsers,
    initialBlogCategories,
    initialBlogs,
    initialFiles,
    initialNotifications,
}) => {
    const socket = useSocket();

    const [users, setUsers] = useState(initialUsers);
    const [blogCategories, setBlogCategories] = useState(initialBlogCategories);
    const [blogs, setBlogs] = useState(initialBlogs);
    const [files, setFiles] = useState(initialFiles);
    const [notifications, setNotifications] = useState(initialNotifications);

    // fetch updated data when the server sends a real-time update
    const refreshData = async () => {
        // users
        const updatedUsersResponse = await fetchDataForClient(
            `${process.env.NEXT_PUBLIC_API_URL}/api/users`
        );
        const updatedUsers = updatedUsersResponse?.data || [];
        const updatedUsersError = updatedUsersResponse?.error || null;

        // blog categories
        const updatedBlogCategoriesResponse = await fetchDataForClient(
            `${process.env.NEXT_PUBLIC_API_URL}/api/blogCategories`
        );
        const updatedBlogCategories = updatedBlogCategoriesResponse?.data || [];
        const updatedBlogCategoriesError =
            updatedBlogCategoriesResponse?.error || null;

        // blogs
        const updatedBlogsResponse = await fetchDataForClient(
            `${process.env.NEXT_PUBLIC_API_URL}/api/blogs`
        );
        const updatedBlogs = updatedBlogsResponse?.data || [];
        const updatedBlogsError = updatedBlogsResponse?.error || null;

        // files
        const updatedFilesResponse = await fetchDataForClient(
            `${process.env.NEXT_PUBLIC_API_URL}/api/files`
        );
        const updatedFiles = updatedFilesResponse?.data || [];
        const updatedFilesError = updatedFilesResponse?.error || null;

        // notifications
        const updatedNotificationsResponse = await fetchDataForClient(
            `${process.env.NEXT_PUBLIC_API_URL}/api/notifications`
        );
        const updatedNotifications = updatedNotificationsResponse?.data || [];
        const updatedNotificationsError =
            updatedNotificationsResponse?.error || null;

        if (
            updatedUsersError ||
            updatedBlogCategoriesError ||
            updatedBlogsError ||
            updatedFilesError ||
            updatedNotificationsError
        ) {
            const errorMessage = [
                updatedUsersError,
                updatedBlogCategoriesError,
                updatedBlogsError,
                updatedFilesError,
                updatedNotificationsError,
            ]
                .filter(Boolean)
                .join("\n");

            toast.error(errorMessage);
        } else {
            setUsers(updatedUsers);
            setBlogCategories(updatedBlogCategories);
            setBlogs(updatedBlogs);
            setFiles(updatedFiles);
            setNotifications(updatedNotifications);
        }
    };

    // listen for real-time events and update ui
    useEffect(() => {
        if (!socket) return;

        socket.on("usersUpdated", refreshData);
        socket.on("blogcategoriesUpdated", refreshData);
        socket.on("blogsUpdated", refreshData);
        socket.on("filesUpdated", refreshData);
        socket.on("notificationsUpdated", refreshData);

        return () => {
            socket.off("usersUpdated", refreshData);
            socket.off("blogcategoriesUpdated", refreshData);
            socket.off("blogsUpdated", refreshData);
            socket.off("filesUpdated", refreshData);
            socket.off("notificationsUpdated", refreshData);
        };
    }, [socket]);

    return (
        <div>
            <div>
                <h1>Dashboard</h1>
                <h2>Total users: {users?.length}</h2>
                <h2>Total blog categories: {blogCategories?.length}</h2>
                <h2>Total blogs: {blogs?.length}</h2>
                <h2>Total files: {files?.length}</h2>
                <h2>Total notifications: {notifications?.length}</h2>
            </div>
        </div>
    );
};

export default AdminDashboardContent;
