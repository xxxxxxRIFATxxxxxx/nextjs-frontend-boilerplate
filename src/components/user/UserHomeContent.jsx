"use client";
import { useEffect, useState } from "react";
import { toast } from "react-toastify";
import { useSocket } from "@/context/SocketProvider";
import fetchDataForClient from "@/helpers/fetchDataForClient";

const UserHomeContent = ({ initialBlogCategories, initialBlogs }) => {
    const socket = useSocket();

    const [blogCategories, setBlogCategories] = useState(initialBlogCategories);
    const [blogs, setBlogs] = useState(initialBlogs);

    // fetch updated data when the server sends a real-time update
    const refreshData = async () => {
        // blog categories
        const updatedBlogCategoriesResponse = await fetchDataForClient(
            `${process.env.NEXT_PUBLIC_API_URL}/api/blogCategories/active`
        );
        const updatedBlogCategories = updatedBlogCategoriesResponse?.data || [];
        const updatedBlogCategoriesError =
            updatedBlogCategoriesResponse?.error || null;

        // blogs
        const updatedBlogsResponse = await fetchDataForClient(
            `${process.env.NEXT_PUBLIC_API_URL}/api/blogs/active`
        );
        const updatedBlogs = updatedBlogsResponse?.data || [];
        const updatedBlogsError = updatedBlogsResponse?.error || null;

        if (updatedBlogCategoriesError || updatedBlogsError) {
            const errorMessage = [updatedBlogCategoriesError, updatedBlogsError]
                .filter(Boolean)
                .join("\n");

            toast.error(errorMessage);
        } else {
            setBlogCategories(updatedBlogCategories);
            setBlogs(updatedBlogs);
        }
    };

    // listen for real-time events and update ui
    useEffect(() => {
        if (!socket) return;

        socket.on("usersUpdated", refreshData);
        socket.on("blogcategoriesUpdated", refreshData);
        socket.on("blogsUpdated", refreshData);

        return () => {
            socket.off("usersUpdated", refreshData);
            socket.off("blogcategoriesUpdated", refreshData);
            socket.off("blogsUpdated", refreshData);
        };
    }, [socket]);

    return (
        <section>
            <div>
                <h1>Home</h1>
                <h2>Total blog categories: {blogCategories?.length}</h2>
                <h2>Total blogs: {blogs?.length}</h2>
            </div>
        </section>
    );
};

export default UserHomeContent;
