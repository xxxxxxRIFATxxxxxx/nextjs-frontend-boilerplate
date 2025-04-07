"use client";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { io } from "socket.io-client";
import { toast } from "react-toastify";
import Select from "react-select";
import formatDateTime from "@/helpers/formatDateTime";
import fetchDataForClient from "@/helpers/fetchDataForClient";

const socket = io(process.env.NEXT_PUBLIC_API_URL);

const UserNotificationList = ({ initialNotifications, initialUsers }) => {
    const router = useRouter();

    const [notifications, setNotifications] = useState(initialNotifications);
    const [users, setUsers] = useState(initialUsers);

    const [search, setSearch] = useState("");
    const [sortBy, setSortBy] = useState("oldest");
    const [startDate, setStartDate] = useState("");
    const [endDate, setEndDate] = useState("");
    const [filteredItems, setFilteredItems] = useState(notifications);

    // fetch updated data when the server sends a real-time update
    const refreshData = async () => {
        // notifications
        const updatedNotificationsResponse = await fetchDataForClient(
            `${process.env.NEXT_PUBLIC_API_URL}/api/notifications/active`
        );
        const updatedNotifications = updatedNotificationsResponse?.data || [];
        const updatedNotificationsError =
            updatedNotificationsResponse?.error || null;

        // users
        const updatedUsersResponse = await fetchDataForClient(
            `${process.env.NEXT_PUBLIC_API_URL}/api/users/active`
        );
        const updatedUsers = updatedUsersResponse?.data || [];
        const updatedUsersError = updatedUsersResponse?.error || null;

        if (updatedNotificationsError || updatedUsersError) {
            const errorMessage = [updatedNotificationsError, updatedUsersError]
                .filter(Boolean)
                .join("\n");

            toast.error(errorMessage);
        } else {
            setNotifications(updatedNotifications);
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
        router.push(`/notifications/${item?._id}`);
    };

    // filtering logic
    useEffect(() => {
        let filtered = [...notifications];

        // search
        if (search) {
            const searchLower = search.toLowerCase();
            filtered = filtered.filter((item) =>
                [
                    item?._id?.toString(),
                    item?.message,
                    item?.targetUrls?.super_admin,
                    item?.targetUrls?.admin,
                    item?.targetUrls?.moderator,
                    item?.targetUrls?.user,
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
    }, [search, sortBy, startDate, endDate, notifications]);

    // listen for real-time events and update ui
    useEffect(() => {
        socket.on("notificationsUpdated", refreshData);
        socket.on("usersUpdated", refreshData);

        return () => {
            socket.off("notificationsUpdated", refreshData);
            socket.off("usersUpdated", refreshData);
        };
    }, []);

    return (
        <div>
            <div>
                <h1>Notification list</h1>
                <h2>Total notifications: {filteredItems?.length}</h2>
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
                        placeholder="Search notifications..."
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

            {/* notification list */}
            <div>
                {filteredItems?.length === 0 ? (
                    <div>No notifications found.</div>
                ) : (
                    filteredItems.map((item) => (
                        <div
                            onClick={() => goToItemDetails(item)}
                            key={item?._id}
                            className="cursor-pointer"
                        >
                            <h2>{item?.message}</h2>

                            <div>{formatDateTime(item?.createdAt)}</div>

                            <div>{formatDateTime(item?.updatedAt)}</div>
                        </div>
                    ))
                )}
            </div>
        </div>
    );
};

export default UserNotificationList;
