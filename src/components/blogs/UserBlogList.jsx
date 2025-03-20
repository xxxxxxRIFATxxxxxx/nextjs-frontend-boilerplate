"use client";
import { useState, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import { useSearchParams } from "next/navigation";
import formatDateTime from "@/helpers/formatDateTime";

const UserBlogList = ({ blogs, blogCategories, users }) => {
    const searchParams = useSearchParams();
    const initialSearch = searchParams.get("search") || "";

    const [search, setSearch] = useState(initialSearch);
    const [categoryFilter, setCategoryFilter] = useState("all");
    const [createdByFilter, setCreatedByFilter] = useState("all");
    const [sortBy, setSortBy] = useState("oldest");
    const [startDate, setStartDate] = useState("");
    const [endDate, setEndDate] = useState("");
    const [filteredItems, setFilteredItems] = useState([]);

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
                    item?.title,
                    item?.category?.name,
                    item?._id?.toString(),
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
                (a, b) => new Date(b.createdAt) - new Date(a.createdAt)
            );
        } else if (sortBy === "oldest") {
            filtered.sort(
                (a, b) => new Date(a.createdAt) - new Date(b.createdAt)
            );
        }

        // search by date time range
        if (startDate && endDate) {
            filtered = filtered.filter((item) => {
                const blogDate = new Date(item.createdAt).getTime();
                return (
                    blogDate >= new Date(startDate).getTime() &&
                    blogDate <= new Date(endDate).getTime()
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

    return (
        <div>
            <div>
                <h1>Blog List</h1>
                <h2>Total Blogs: {filteredItems.length}</h2>
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
                    <label htmlFor="category" className="">
                        Category
                    </label>

                    <select
                        name="category"
                        id="category"
                        className=""
                        value={categoryFilter}
                        onChange={(e) => setCategoryFilter(e.target.value)}
                    >
                        <option value="all">All</option>

                        {blogCategories?.map((category) => (
                            <option key={category._id} value={category.name}>
                                {category.name}
                            </option>
                        ))}
                    </select>
                </div>

                {/* filter by created by */}
                <div>
                    <label htmlFor="createdBy" className="">
                        Created By
                    </label>

                    <select
                        name="createdBy"
                        id="createdBy"
                        className=""
                        value={createdByFilter}
                        onChange={(e) => setCreatedByFilter(e.target.value)}
                    >
                        <option value="all">All</option>

                        {users?.map((user) => (
                            <option key={user._id} value={user.fullName}>
                                {user.fullName}
                            </option>
                        ))}
                    </select>
                </div>

                {/* sort by newest or oldest */}
                <div>
                    <label htmlFor="sortBy" className="">
                        Sort by
                    </label>

                    <select
                        name="sortBy"
                        id="sortBy"
                        className=""
                        value={sortBy}
                        onChange={(e) => setSortBy(e.target.value)}
                    >
                        <option value="newest">Newest</option>
                        <option value="oldest">Oldest</option>
                    </select>
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

            {/* table */}
            <div className="overflow-x-auto">
                <table>
                    <thead>
                        <tr>
                            <th>#</th>
                            <th>Thumbnail</th>
                            <th>Title</th>
                            <th>Category</th>
                            <th>Created By</th>
                            <th>Created</th>
                            <th>Updated</th>
                        </tr>
                    </thead>

                    <tbody>
                        {filteredItems.length === 0 ? (
                            <tr>
                                <td colSpan="7">No blogs found.</td>
                            </tr>
                        ) : (
                            filteredItems.map((item, index) => (
                                <tr key={item?._id}>
                                    <td>{index + 1}</td>

                                    <td>
                                        <Image
                                            src={item?.thumbnail}
                                            className="w-auto h-auto object-cover"
                                            width={100}
                                            height={100}
                                            alt="thumbnail"
                                            priority
                                        />
                                    </td>

                                    <td>
                                        <Link
                                            href={`/blogs/${item?.slug}`}
                                            className="hover:underline"
                                        >
                                            {item?.title}
                                        </Link>
                                    </td>

                                    <td>{item?.category?.name}</td>

                                    <td>{item?.createdBy?.fullName}</td>

                                    <td>{formatDateTime(item?.createdAt)}</td>

                                    <td>{formatDateTime(item?.updatedAt)}</td>
                                </tr>
                            ))
                        )}
                    </tbody>
                </table>
            </div>
        </div>
    );
};

export default UserBlogList;
