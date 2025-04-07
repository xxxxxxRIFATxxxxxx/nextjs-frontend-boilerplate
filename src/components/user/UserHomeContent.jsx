"use client";
import { useEffect, useState } from "react";
import { io } from "socket.io-client";
import { toast } from "react-toastify";
import fetchDataForClient from "@/helpers/fetchDataForClient";

const socket = io(process.env.NEXT_PUBLIC_API_URL);

const UserHomeContent = ({ initialBlogCategories, initialBlogs }) => {
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
        socket.on("usersUpdated", refreshData);
        socket.on("blogcategoriesUpdated", refreshData);
        socket.on("blogsUpdated", refreshData);

        return () => {
            socket.off("usersUpdated", refreshData);
            socket.off("blogcategoriesUpdated", refreshData);
            socket.off("blogsUpdated", refreshData);
        };
    }, []);

    return (
        <div>
            <div>
                <h1>Home</h1>
                <h2>Total blog categories: {blogCategories?.length}</h2>
                <h2>Total blogs: {blogs?.length}</h2>
            </div>
        </div>
    );
};

export default UserHomeContent;
