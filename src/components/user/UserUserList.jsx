"use client";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import { toast } from "react-toastify";
import Select from "react-select";
import DefaultUserIcon from "@/components/common/DefaultUserIcon";
import { useSocket } from "@/context/SocketProvider";
import formatDateTime from "@/helpers/formatDateTime";
import fetchDataForClient from "@/helpers/fetchDataForClient";

const UserUserList = ({ initialUsers }) => {
    const router = useRouter();
    const socket = useSocket();

    const [users, setUsers] = useState(initialUsers);

    const [search, setSearch] = useState("");
    const [sortBy, setSortBy] = useState("oldest");
    const [startDate, setStartDate] = useState("");
    const [endDate, setEndDate] = useState("");
    const [filteredItems, setFilteredItems] = useState(users);

    // fetch updated data when the server sends a real-time update
    const refreshData = async () => {
        // users
        const updatedUsersResponse = await fetchDataForClient(
            `${process.env.NEXT_PUBLIC_API_URL}/api/users/active`
        );
        const updatedUsers = updatedUsersResponse?.data || [];
        const updatedUsersError = updatedUsersResponse?.error || null;

        if (updatedUsersError) {
            const errorMessage = [updatedUsersError].filter(Boolean).join("\n");
            toast.error(errorMessage);
        } else {
            setUsers(updatedUsers);
        }
    };

    // reset date time range filter
    const resetDateFilter = () => {
        setStartDate("");
        setEndDate("");
    };

    // navigate to the item details page
    const goToItemDetails = (item) => {
        router.push(`/users/${item?._id}`);
    };

    // filtering logic
    useEffect(() => {
        let filtered = [...users];

        // search
        if (search) {
            const searchLower = search.toLowerCase();
            filtered = filtered.filter((item) =>
                [
                    item?._id?.toString(),
                    item?.fullName,
                    item?.email,
                    item?.phone,
                    item?.username,
                    item?.role,
                ]
                    .map((field) => field?.toLowerCase() ?? "")
                    .some((field) => field?.includes(searchLower))
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
    }, [search, sortBy, startDate, endDate, users]);

    // listen for real-time events and update ui
    useEffect(() => {
        if (!socket) return;

        socket.on("usersUpdated", refreshData);

        return () => {
            socket.off("usersUpdated", refreshData);
        };
    }, [socket]);

    return (
        <section>
            <div>
                <h1>User list</h1>
                <h2>Total users: {filteredItems?.length}</h2>
            </div>

            <div>
                {/* search bar */}
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
                        placeholder="Search users..."
                        value={search}
                        onChange={(e) => setSearch(e.target.value)}
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
                                Start date
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
                            End date
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
                                Reset date time
                            </button>
                        </div>
                    </form>
                </div>
            </div>

            {/* user list */}
            <div>
                {filteredItems?.length === 0 ? (
                    <div>No users found.</div>
                ) : (
                    filteredItems.map((item) => (
                        <div
                            onClick={() => goToItemDetails(item)}
                            key={item?._id}
                            className="cursor-pointer"
                        >
                            <div>
                                {item?.image ? (
                                    <Image
                                        src={item?.image}
                                        className="w-[200px] h-[200px] object-cover rounded-full"
                                        width={200}
                                        height={200}
                                        alt="user image"
                                        priority
                                    />
                                ) : (
                                    <DefaultUserIcon
                                        width="w-[200px]"
                                        height="h-[200px]"
                                        iconSize={100}
                                    />
                                )}
                            </div>

                            <h2>{item?.fullName}</h2>

                            <h2>{item?.email}</h2>

                            <h2>{item?.phone}</h2>

                            <h2>{item?.username}</h2>

                            <h2>{item?.role}</h2>

                            <div>{formatDateTime(item?.createdAt)}</div>

                            <div>{formatDateTime(item?.updatedAt)}</div>
                        </div>
                    ))
                )}
            </div>
        </section>
    );
};

export default UserUserList;
