"use client";
import { useState, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import { useSearchParams } from "next/navigation";
import { io } from "socket.io-client";
import Select from "react-select";
import formatDateTime from "@/helpers/formatDateTime";
import fetchDataForClient from "@/helpers/fetchDataForClient";

const socket = io(process.env.NEXT_PUBLIC_API_URL);

const UserBlogList = ({
    initialBlogs,
    initialBlogCategories,
    initialUsers,
}) => {
    const [blogs, setBlogs] = useState(initialBlogs);
    const [blogCategories, setBlogCategories] = useState(initialBlogCategories);
    const [users, setUsers] = useState(initialUsers);

    const searchParams = useSearchParams();
    const initialSearch = searchParams.get("search") || "";

    const [search, setSearch] = useState(initialSearch);
    const [categoryFilter, setCategoryFilter] = useState("all");
    const [createdByFilter, setCreatedByFilter] = useState("all");
    const [sortBy, setSortBy] = useState("oldest");
    const [startDate, setStartDate] = useState("");
    const [endDate, setEndDate] = useState("");
    const [filteredItems, setFilteredItems] = useState([]);

    // fetch updated data when the server sends a real-time update
    const refreshData = async () => {
        const updatedBlogsResponse = await fetchDataForClient(
            `${process.env.NEXT_PUBLIC_API_URL}/api/blogs/get/only/active`
        );

        const updatedCategoriesResponse = await fetchDataForClient(
            `${process.env.NEXT_PUBLIC_API_URL}/api/blogCategories/get/only/active`
        );

        const updatedUsersResponse = await fetchDataForClient(
            `${process.env.NEXT_PUBLIC_API_URL}/api/users/get/only/active`
        );

        const updatedBlogs = updatedBlogsResponse?.data || [];
        const updatedBlogCategories = updatedCategoriesResponse?.data || [];
        const updatedUsers = updatedUsersResponse?.data || [];

        const updatedBlogsError = updatedBlogsResponse?.error || null;
        const updatedBlogCategoriesError =
            updatedCategoriesResponse?.error || null;
        const updatedUsersError = updatedUsersResponse?.error || null;

        if (
            updatedBlogsError ||
            updatedBlogCategoriesError ||
            updatedUsersError
        ) {
            const errorMessage = [
                updatedBlogsError,
                updatedBlogCategoriesError,
                updatedUsersError,
            ]
                .filter(Boolean)
                .join("\n");

            toast.error(errorMessage);
        } else {
            setBlogs(updatedBlogs);
            setBlogCategories(updatedBlogCategories);
            setUsers(updatedUsers);
        }
    };

    // reset date time range filter
    const resetDateFilter = () => {
        setStartDate("");
        setEndDate("");
    };

    // filtering logic
    useEffect(() => {
        let filtered = [...blogs];

        // search
        if (search) {
            const searchLower = search.toLowerCase();
            filtered = filtered.filter((item) =>
                [
                    item?._id?.toString(),
                    item?.title,
                    item?.category?.name,
                    item?.status,
                    item?.createdBy?.fullName,
                    item?.createdBy?.email,
                    item?.createdBy?.phone,
                    item?.createdBy?.username,
                    item?.createdBy?.role,
                ]
                    .map((field) => field?.toLowerCase() ?? "")
                    .some((field) => field.includes(searchLower))
            );
        }

        // filter by category
        if (categoryFilter !== "all") {
            filtered = filtered.filter(
                (item) => item?.category?.name === categoryFilter
            );
        }

        // filter by created by
        if (createdByFilter !== "all") {
            filtered = filtered.filter(
                (item) => item?.createdBy?.fullName === createdByFilter
            );
        }

        // sort by newest or oldest
        if (sortBy === "newest") {
            filtered.sort(
                (a, b) => new Date(b?.createdAt) - new Date(a?.createdAt)
            );
        } else if (sortBy === "oldest") {
            filtered.sort(
                (a, b) => new Date(a?.createdAt) - new Date(b?.createdAt)
            );
        }

        // search by date time range
        if (startDate && endDate) {
            filtered = filtered.filter((item) => {
                const itemDate = new Date(item?.createdAt).getTime();
                return (
                    itemDate >= new Date(startDate).getTime() &&
                    itemDate <= new Date(endDate).getTime()
                );
            });
        }

        setFilteredItems(filtered);
    }, [
        search,
        categoryFilter,
        createdByFilter,
        sortBy,
        startDate,
        endDate,
        blogs,
    ]);

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
            <div>
                <h1>Blog List</h1>
                <h2>Total Blogs: {filteredItems?.length}</h2>
            </div>

            <div>
                {/* search Bar */}
                <div>
                    <label htmlFor="search" className="">
                        Search
                    </label>

                    <input
                        type="search"
                        name="search"
                        id="search"
                        autoComplete="on"
                        className=""
                        placeholder="Search blogs..."
                        value={search}
                        onChange={(e) => setSearch(e.target.value)}
                    />
                </div>

                {/* filter by blog category */}
                <div>
                    <span className="">Category</span>

                    <Select
                        options={[
                            { label: "All", value: "all" },
                            ...blogCategories.map((blogCategory) => ({
                                label: blogCategory?.name,
                                value: blogCategory?.name,
                            })),
                        ]}
                        onChange={(selectedOption) =>
                            setCategoryFilter(selectedOption?.value)
                        }
                        className=""
                        placeholder="Search and select category"
                        value={
                            categoryFilter
                                ? {
                                      label:
                                          categoryFilter === "all"
                                              ? "All"
                                              : blogCategories.find(
                                                    (blogCategory) =>
                                                        blogCategory?.name ===
                                                        categoryFilter
                                                )?.name || "All",
                                      value: categoryFilter,
                                  }
                                : null
                        }
                    />
                </div>

                {/* filter by created by */}
                <div>
                    <span className="">Created By</span>

                    <Select
                        options={[
                            { label: "All", value: "all" },
                            ...users.map((user) => ({
                                label: user.fullName,
                                value: user.fullName,
                            })),
                        ]}
                        onChange={(selectedOption) =>
                            setCreatedByFilter(selectedOption?.value)
                        }
                        className=""
                        placeholder="Search and select user"
                        value={
                            createdByFilter
                                ? {
                                      label:
                                          createdByFilter === "all"
                                              ? "All"
                                              : users.find(
                                                    (user) =>
                                                        user.fullName ===
                                                        createdByFilter
                                                )?.fullName || "All",
                                      value: createdByFilter,
                                  }
                                : null
                        }
                    />
                </div>

                {/* sort by newest or oldest */}
                <div>
                    <span className="">Sort by</span>

                    <Select
                        options={[
                            { label: "Newest", value: "newest" },
                            { label: "Oldest", value: "oldest" },
                        ]}
                        onChange={(selectedOption) =>
                            setSortBy(selectedOption?.value)
                        }
                        className=""
                        placeholder="Select sorting order"
                        value={
                            sortBy
                                ? {
                                      label:
                                          sortBy === "newest"
                                              ? "Newest"
                                              : "Oldest",
                                      value: sortBy,
                                  }
                                : null
                        }
                    />
                </div>

                {/* search by date time rang */}
                <div>
                    <form onSubmit={(e) => e.preventDefault()}>
                        <div>
                            <label htmlFor="startDate" className="">
                                Start Date
                            </label>

                            <input
                                type="datetime-local"
                                name="startDate"
                                id="startDate"
                                autoComplete="off"
                                className=""
                                value={startDate}
                                onChange={(e) => setStartDate(e.target.value)}
                            />
                        </div>

                        <label htmlFor="endDate" className="">
                            End Date
                        </label>

                        <input
                            type="datetime-local"
                            name="endDate"
                            id="endDate"
                            autoComplete="off"
                            className=""
                            value={endDate}
                            onChange={(e) => setEndDate(e.target.value)}
                        />

                        <div>
                            <button type="button" onClick={resetDateFilter}>
                                Reset Date Time
                            </button>
                        </div>
                    </form>
                </div>
            </div>

            {/* blog list */}
            <div>
                {filteredItems?.length === 0 ? (
                    <div>No blogs found.</div>
                ) : (
                    filteredItems.map((item, index) => (
                        <div key={item?._id}>
                            <div>
                                <Image
                                    src={item?.thumbnail}
                                    className="w-auto h-auto object-cover"
                                    width={100}
                                    height={100}
                                    alt="thumbnail"
                                    priority
                                />
                            </div>

                            <h2>
                                <Link
                                    href={`/blogs/${item?.slug}`}
                                    className="hover:underline"
                                >
                                    {item?.title}
                                </Link>
                            </h2>

                            <div>{item?.category?.name}</div>

                            <div>{item?.createdBy?.fullName}</div>

                            <div>{formatDateTime(item?.createdAt)}</div>

                            <div>{formatDateTime(item?.updatedAt)}</div>
                        </div>
                    ))
                )}
            </div>
        </div>
    );
};

export default UserBlogList;
