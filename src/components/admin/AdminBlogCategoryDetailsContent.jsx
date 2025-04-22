"use client";
import { useEffect, useState } from "react";
import Link from "next/link";
import { toast } from "react-toastify";
import { useSocket } from "@/context/SocketProvider";
import formatDateTime from "@/helpers/formatDateTime";
import fetchDataForClient from "@/helpers/fetchDataForClient";

const AdminBlogCategoryDetailsContent = ({ initialBlogCategory, slug }) => {
    const socket = useSocket();

    const [blogCategory, setBlogCategory] = useState(initialBlogCategory);

    // fetch updated data when the server sends a real-time update
    const refreshData = async () => {
        // blog category
        const updatedBlogCategoryResponse = await fetchDataForClient(
            `${process.env.NEXT_PUBLIC_API_URL}/api/blogCategories/slug/${slug}`
        );
        const updatedBlogCategory = updatedBlogCategoryResponse?.data || null;
        const updatedBlogCategoryError =
            updatedBlogCategoryResponse?.error || null;

        if (updatedBlogCategoryError) {
            toast.error(updatedBlogCategoryError);
        } else {
            setBlogCategory(updatedBlogCategory);
        }
    };

    // listen for real-time events and update ui
    useEffect(() => {
        if (!socket) return;

        socket.on("blogcategoriesUpdated", refreshData);

        return () => {
            socket.off("blogcategoriesUpdated", refreshData);
        };
    }, [socket]);

    return (
        <section>
            <div>
                <Link href="/admin/blog-categories">Back</Link>
            </div>

            <div>
                <h2>Id</h2>
                <p>{blogCategory?._id}</p>
            </div>

            <div>
                <h2>Title</h2>
                <p>{blogCategory?.title}</p>
            </div>

            <div>
                <h2>Slug</h2>
                <p>{blogCategory?.slug}</p>
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
        </section>
    );
};

export default AdminBlogCategoryDetailsContent;
