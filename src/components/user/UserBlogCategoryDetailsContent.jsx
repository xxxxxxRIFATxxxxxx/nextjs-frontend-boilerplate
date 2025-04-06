"use client";
import { useEffect, useState } from "react";
import Link from "next/link";
import { io } from "socket.io-client";
import { toast } from "react-toastify";
import formatDateTime from "@/helpers/formatDateTime";
import fetchDataForClient from "@/helpers/fetchDataForClient";

const socket = io(process.env.NEXT_PUBLIC_API_URL);

const UserBlogCategoryDetailsContent = ({ initialBlogCategory, slug }) => {
    const [blogCategory, setBlogCategory] = useState(initialBlogCategory);

    // fetch updated data when the server sends a real-time update
    const refreshData = async () => {
        const updatedBlogCategoryResponse = await fetchDataForClient(
            `${process.env.NEXT_PUBLIC_API_URL}/api/blog-categories/active/slug/${slug}`
        );

        const updatedBlogCategory = updatedBlogCategoryResponse?.data || null;
        const updatedBlogCategoryError =
            updatedBlogCategoryResponse?.error || null;

        if (updatedBlogCategoryError) {
            toast.error(updatedBlogCategoryError);
        } else {
            setBlog(updatedBlogCategory);
        }
    };

    // listen for real-time events and update ui
    useEffect(() => {
        socket.on("blogcategoriesUpdated", refreshData);

        return () => {
            socket.off("blogcategoriesUpdated", refreshData);
        };
    }, []);

    return (
        <div>
            <div>
                <Link href="/blog-categories">Back</Link>
            </div>

            <div>
                <h2>Title</h2>
                <p>{blogCategory?.title}</p>
            </div>

            <div>
                <h2>Status</h2>
                <p>{blogCategory?.status}</p>
            </div>

            <div>
                <h2>Created</h2>
                <p>{formatDateTime(blogCategory?.createdAt)}</p>
            </div>

            <div>
                <h2>Updated</h2>
                <p>{formatDateTime(blogCategory?.updatedAt)}</p>
            </div>
        </div>
    );
};

export default UserBlogCategoryDetailsContent;
