"use client";
import { useEffect, useState } from "react";
import Head from "next/head";
import Image from "next/image";
import { io } from "socket.io-client";
import { toast } from "react-toastify";
import formatDateTime from "@/helpers/formatDateTime";
import fetchDataForClient from "@/helpers/fetchDataForClient";

const socket = io(process.env.NEXT_PUBLIC_API_URL);

const BlogDetailsClient = ({ initialBlog, slug }) => {
    const [blog, setBlog] = useState(initialBlog);

    // fetch updated data when the server sends a real-time update
    const refreshData = async () => {
        const updatedBlogResponse = await fetchDataForClient(
            `${process.env.NEXT_PUBLIC_API_URL}/api/blogs/get/only/active/slug/${slug}`
        );

        const updatedBlog = updatedBlogResponse?.data || null;
        const updatedBlogError = updatedBlogResponse?.error || null;

        if (updatedBlogError) {
            toast.error(updatedBlogError);
        } else {
            setBlog(updatedBlog);
        }
    };

    // listen for real-time events and update ui
    useEffect(() => {
        socket.on("blogsUpdated", refreshData);
        socket.on("blogcategoriesUpdated", refreshData);
        socket.on("usersUpdated", refreshData);

        return () => {
            socket.off("blogsUpdated", refreshData);
            socket.off("blogcategoriesUpdated", refreshData);
            socket.off("usersUpdated", refreshData);
        };
    }, []);

    return (
        <div>
            <Head>
                <title>{blog?.title}</title>

                <meta name="description" content={blog?.description} />

                <meta property="og:title" content={blog?.title} />

                <meta property="og:description" content={blog?.description} />
                <meta property="og:image" content={blog?.coverImage} />
            </Head>

            <div>
                <h2>Thumbnail</h2>

                <Image
                    src={blog?.thumbnail}
                    className="w-auto h-auto"
                    width={500}
                    height={500}
                    alt="thumbnail"
                    priority
                />
            </div>

            <div>
                <h2>Cover Image</h2>

                <Image
                    src={blog?.coverImage}
                    className="w-auto h-auto"
                    width={500}
                    height={500}
                    alt="cover image"
                />
            </div>

            <div>
                <h2>Images</h2>
                <div className="grid grid-cols1 md:grid-cols-2 gap-4">
                    {blog?.images?.map((image, index) => (
                        <Image
                            key={index}
                            src={image}
                            className="w-auto h-auto"
                            width={500}
                            height={500}
                            alt="image"
                        />
                    ))}
                </div>
            </div>

            <div>
                <h2>Title</h2>
                <p>{blog?.title}</p>
            </div>

            <div>
                <h2>Description</h2>
                <div
                    dangerouslySetInnerHTML={{
                        __html: blog?.description,
                    }}
                ></div>
            </div>

            <div>
                <h2>Category</h2>
                <p>{blog?.category?.title}</p>
            </div>

            <div>
                <h2>Created By</h2>
                <p>{blog?.createdBy?.fullName}</p>
            </div>

            <div>
                <h2>Created</h2>
                <p>{formatDateTime(blog?.createdAt)}</p>
            </div>

            <div>
                <h2>Updated</h2>
                <p>{formatDateTime(blog?.updatedAt)}</p>
            </div>
        </div>
    );
};

export default BlogDetailsClient;
