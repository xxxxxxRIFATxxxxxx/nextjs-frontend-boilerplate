"use client";
import { useEffect, useState } from "react";
import { io } from "socket.io-client";
import { Edit, Eye, Trash2 } from "lucide-react";
import { toast } from "react-toastify";
import Select from "react-select";
import useCrud from "@/hooks/useCrud";
import Modal from "@/components/common/Modal";
import DownloadCSVButton from "@/components/common/DownloadCSVButton";
import Spinner from "@/components/common/Spinner";
import formatDateTime from "@/helpers/formatDateTime";
import fetchDataForClient from "@/helpers/fetchDataForClient";

const socket = io(process.env.NEXT_PUBLIC_API_URL);

const NotificationList = ({ initialNotifications, initialUsers }) => {
    const [notifications, setNotifications] = useState(initialNotifications);
    const [users, setUsers] = useState(initialUsers);

    const [search, setSearch] = useState("");
    const [sortBy, setSortBy] = useState("oldest");
    const [itemStatus, setItemStatus] = useState("all");
    const [startDate, setStartDate] = useState("");
    const [endDate, setEndDate] = useState("");
    const [filteredItems, setFilteredItems] = useState(notifications);
    const { createItem, updateItem, deleteItem, deleteMultipleItems, loading } =
        useCrud("notifications");

    const [isAddOrEditModalOpen, setIsAddOrEditModalOpen] = useState(false);
    const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
    const [isDeleteSelectedModalOpen, setIsDeleteSelectedModalOpen] =
        useState(false);
    const [isViewModalOpen, setIsViewModalOpen] = useState(false);
    const [selectedItem, setSelectedItem] = useState(null);
    const [selectedItems, setSelectedItems] = useState([]);
    const [selectAll, setSelectAll] = useState(false);
    const [seenBy, setSeenBy] = useState([]);
    const [specificUsers, setSpecificUsers] = useState([]);
    const [recipientRoles, setRecipientRoles] = useState([]);
    const [status, setStatus] = useState(null);
    const roleOptions = [
        { label: "Super Admin", value: "super_admin" },
        { label: "Admin", value: "admin" },
        { label: "Moderator", value: "moderator" },
        { label: "User", value: "user" },
    ];
    const statusOptions = [
        { label: "Active", value: "active" },
        { label: "Inactive", value: "inactive" },
    ];

    // fetch updated data when the server sends a real-time update
    const refreshData = async () => {
        const updatedNotificationsResponse = await fetchDataForClient(
            `${process.env.NEXT_PUBLIC_API_URL}/api/notifications`
        );
        const updatedUsersResponse = await fetchDataForClient(
            `${process.env.NEXT_PUBLIC_API_URL}/api/users`
        );

        const updatedNotifications = updatedNotificationsResponse?.data || [];
        const updatedUsers = updatedUsersResponse?.data || [];

        const updatedNotificationsError =
            updatedNotificationsResponse?.error || null;
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

    // open modal for add or edit
    const openAddOrEditModal = (item = null) => {
        setSelectedItem(item);
        setIsAddOrEditModalOpen(true);
    };

    // close modal for add or edit
    const closeAddOrEditModal = () => {
        removeExixtingItems();
        setIsAddOrEditModalOpen(false);
    };

    // open view modal
    const openViewModal = (item) => {
        setSelectedItem(item);
        setIsViewModalOpen(true);
    };

    // close view modal
    const closeViewModal = () => {
        removeExixtingItems();
        setIsViewModalOpen(false);
    };

    // open delete confirmation modal
    const openDeleteModal = (item) => {
        setSelectedItem(item);
        setIsDeleteModalOpen(true);
    };

    // close delete confirmation modal
    const closeDeleteModal = () => {
        removeExixtingItems();
        setIsDeleteModalOpen(false);
    };

    // open delete selected confirmation modal
    const openDeleteSelectedModal = (item) => {
        setIsDeleteSelectedModalOpen(true);
    };

    // close delete selected confirmation modal
    const closeDeleteSelectedModal = () => {
        setIsDeleteSelectedModalOpen(false);
    };

    // handle item creation or update
    const handleSave = async (e) => {
        e.preventDefault();

        const message = e.target.message.value.trim();
        const seenByIds = seenBy.map((user) => user?.value);
        const specificUserIds = specificUsers.map((user) => user?.value);
        const recipientRoleValues = recipientRoles.map((role) => role?.value);
        const targetUrl = e.target.targetUrl.value.trim();
        const statusValue = status?.value;

        if (selectedItem) {
            const response = await updateItem(selectedItem?._id, {
                message,
                seenBy: seenByIds,
                specificUsers: specificUserIds,
                recipientRoles: recipientRoleValues,
                targetUrl,
                status: statusValue,
            });

            if (response?.data) {
                const updatedItem = response?.data;

                setFilteredItems((prev) =>
                    prev.map((item) =>
                        item?._id === selectedItem?._id
                            ? {
                                  ...updatedItem,
                              }
                            : item
                    )
                );
                toast.success(response?.message);
                closeAddOrEditModal();
            } else {
                toast.error(response);
            }
        } else {
            const response = await createItem({
                message,
                seenBy: seenByIds,
                specificUsers: specificUserIds,
                recipientRoles: recipientRoleValues,
                targetUrl,
                status: statusValue,
            });

            if (response?.data) {
                const newItem = response?.data;

                setFilteredItems((prev) => [
                    ...prev,
                    {
                        ...newItem,
                    },
                ]);

                toast.success(response?.message);
                closeAddOrEditModal();
            } else {
                toast.error(response);
            }
        }
    };

    // handle item deletion
    const handleDelete = async () => {
        const response = await deleteItem(selectedItem?._id);

        if (response?.message) {
            setFilteredItems((prev) =>
                prev.filter((item) => item?._id !== selectedItem?._id)
            );
            toast.success(response?.message);
            setIsDeleteModalOpen(false);
        } else {
            toast.error(response);
        }
    };

    // handle select all
    const handleSelectAll = () => {
        setSelectAll(!selectAll);
        setSelectedItems(
            selectAll ? [] : filteredItems.map((item) => item?._id)
        );
    };

    // handle individual selection
    const handleSelectItem = (id) => {
        setSelectedItems((prev) =>
            prev.includes(id)
                ? prev.filter((itemId) => itemId !== id)
                : [...prev, id]
        );
    };

    // handle bulk delete
    const handleBulkDelete = async () => {
        if (selectedItems.length === 0) return;

        const response = await deleteMultipleItems(selectedItems);

        if (response?.message) {
            setFilteredItems((prev) =>
                prev.filter((item) => !selectedItems.includes(item?._id))
            );
            toast.success(response?.message);
            setSelectedItems([]);
            setSelectAll(false);
            setIsDeleteSelectedModalOpen(false);
        } else {
            toast.error(response);
        }
    };

    // for remove exixting items
    const removeExixtingItems = () => {
        setSelectedItem(null);
        setSeenBy([]);
        setSpecificUsers([]);
        setRecipientRoles([]);
        setStatus(null);
    };

    // filtering logic
    useEffect(() => {
        let filtered = [...notifications];

        // search
        if (search) {
            const searchLower = search.toLowerCase();
            filtered = filtered.filter((item) =>
                [item?._id?.toString(), item?.message, item?.status]
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

        // filter by status
        if (itemStatus !== "all") {
            filtered = filtered.filter((item) => item?.status === itemStatus);
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
    }, [search, sortBy, itemStatus, startDate, endDate, notifications]);

    // update state when selectedItem changes
    useEffect(() => {
        setSeenBy(
            selectedItem?.seenBy?.map((user) => ({
                label: user?.email,
                value: user?._id,
            })) || []
        );

        setSpecificUsers(
            selectedItem?.specificUsers?.map((user) => ({
                label: user?.email,
                value: user?._id,
            })) || []
        );

        setRecipientRoles(
            roleOptions.filter((role) =>
                selectedItem?.recipientRoles?.includes(role?.value)
            ) || []
        );

        setStatus(
            statusOptions.find(
                (status) => status?.value === selectedItem?.status
            ) || null
        );
    }, [selectedItem]);

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
                <h1>Notification List</h1>
                <h2>Total Notifications: {filteredItems?.length}</h2>
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

                {/* filter by status */}
                <div>
                    <span className="">Status</span>

                    <Select
                        options={[
                            { label: "All", value: "all" },
                            { label: "Active", value: "active" },
                            { label: "Inactive", value: "inactive" },
                        ]}
                        onChange={(selectedOption) =>
                            setItemStatus(selectedOption?.value)
                        }
                        className=""
                        placeholder="Select status"
                        value={
                            itemStatus
                                ? {
                                      label:
                                          itemStatus === "all"
                                              ? "All"
                                              : itemStatus === "active"
                                              ? "Active"
                                              : "Inactive",
                                      value: itemStatus,
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

                {/* delete selected button */}
                <div>
                    {selectedItems.length > 0 && (
                        <button type="button" onClick={openDeleteSelectedModal}>
                            Delete Selected
                        </button>
                    )}
                </div>

                {/* add item button */}
                <div>
                    <button type="button" onClick={() => openAddOrEditModal()}>
                        Add New
                    </button>
                </div>

                {/* download csv button */}
                <DownloadCSVButton
                    data={filteredItems}
                    filename="notifications.csv"
                    selectedColumns={[
                        "_id",
                        "message",
                        "recipientRoles",
                        "targetUrl",
                        "status",
                        "createdAt",
                        "updatedAt",
                    ]}
                />
            </div>

            {/* table */}
            <div className="overflow-x-auto">
                <table>
                    <thead>
                        <tr>
                            <th>
                                <input
                                    type="checkbox"
                                    name="selectAll"
                                    id="selectAll"
                                    className=""
                                    checked={selectAll}
                                    onChange={handleSelectAll}
                                />
                            </th>

                            <th>#</th>

                            <th>Id</th>

                            <th>Message</th>

                            <th>Recipient Roles</th>

                            <th>Target Url</th>

                            <th>Status</th>

                            <th>Created</th>

                            <th>Updated</th>

                            <th>Actions</th>
                        </tr>
                    </thead>

                    <tbody>
                        {filteredItems?.length === 0 ? (
                            <tr>
                                <td colSpan="10" className="text-center">
                                    No notifications found.
                                </td>
                            </tr>
                        ) : (
                            filteredItems.map((item, index) => (
                                <tr key={item?._id}>
                                    <td>
                                        <input
                                            type="checkbox"
                                            name={`select${index}`}
                                            id={`select${index}`}
                                            className=""
                                            checked={selectedItems.includes(
                                                item?._id
                                            )}
                                            onChange={() =>
                                                handleSelectItem(item?._id)
                                            }
                                        />
                                    </td>

                                    <td>{index + 1}</td>

                                    <td>
                                        <span
                                            className="hover:underline cursor-pointer"
                                            onClick={() => openViewModal(item)}
                                        >
                                            {item?._id}
                                        </span>
                                    </td>

                                    <td>
                                        <span
                                            className="hover:underline cursor-pointer"
                                            onClick={() => openViewModal(item)}
                                        >
                                            {item?.message}
                                        </span>
                                    </td>

                                    <td>
                                        {item?.recipientRoles?.map(
                                            (role, index) => (
                                                <span key={index}>
                                                    {role}
                                                    {index !==
                                                        item.recipientRoles
                                                            .length -
                                                            1 && ", "}
                                                    <br />
                                                </span>
                                            )
                                        )}
                                    </td>

                                    <td>{item?.targetUrl}</td>

                                    <td>{item?.status}</td>

                                    <td>{formatDateTime(item?.createdAt)}</td>

                                    <td>{formatDateTime(item?.updatedAt)}</td>

                                    <td className="p-[18px] relative">
                                        <button
                                            type="button"
                                            className="cursor-pointer"
                                            onClick={() =>
                                                openAddOrEditModal(item)
                                            }
                                        >
                                            <Edit className="w-4 h-4" />
                                        </button>

                                        <button
                                            type="button"
                                            className="cursor-pointer"
                                            onClick={() => openViewModal(item)}
                                        >
                                            <Eye className="w-4 h-4" />
                                        </button>

                                        <button
                                            type="button"
                                            className="cursor-pointer"
                                            onClick={() =>
                                                openDeleteModal(item)
                                            }
                                        >
                                            <Trash2 className="w-4 h-4" />
                                        </button>
                                    </td>
                                </tr>
                            ))
                        )}
                    </tbody>
                </table>
            </div>

            {/* add or edit modal */}
            <Modal
                title={
                    selectedItem ? "Edit Notification" : "Add New Notification"
                }
                isOpen={isAddOrEditModalOpen}
                onClose={closeAddOrEditModal}
                width="max-w-4xl"
            >
                <div>
                    <form onSubmit={handleSave}>
                        <div>
                            <label htmlFor="message" className="">
                                Message
                            </label>

                            <input
                                type="text"
                                name="message"
                                id="message"
                                autoComplete="off"
                                className=""
                                placeholder="Enter message"
                                defaultValue={selectedItem?.message || ""}
                                required
                            />
                        </div>

                        <div>
                            <span className="">Seen by</span>

                            <Select
                                options={users.map((user) => ({
                                    label: user?.email,
                                    value: user?._id,
                                }))}
                                isMulti
                                onChange={setSeenBy}
                                className=""
                                placeholder="Search and select seen by"
                                value={seenBy}
                            />
                        </div>

                        <div>
                            <span className="">Specific users</span>

                            <Select
                                options={users.map((user) => ({
                                    label: user?.email,
                                    value: user?._id,
                                }))}
                                isMulti
                                onChange={setSpecificUsers}
                                className=""
                                placeholder="Search and select users"
                                value={specificUsers}
                            />
                        </div>

                        <div>
                            <span className="">Recipient roles</span>

                            <Select
                                options={roleOptions}
                                isMulti
                                onChange={setRecipientRoles}
                                className=""
                                placeholder="Select recipient roles"
                                defaultValue={roleOptions.filter((role) =>
                                    selectedItem?.recipientRoles?.includes(
                                        role?.value
                                    )
                                )}
                                required
                            />
                        </div>

                        <div>
                            <label htmlFor="targetUrl" className="">
                                Target Url
                            </label>

                            <input
                                type="text"
                                name="targetUrl"
                                id="targetUrl"
                                autoComplete="url"
                                className=""
                                placeholder="Enter target url"
                                defaultValue={selectedItem?.targetUrl || ""}
                                required
                            />
                        </div>

                        <div>
                            <span className="">Status</span>

                            <Select
                                options={statusOptions}
                                onChange={setStatus}
                                className=""
                                placeholder="Select status"
                                defaultValue={
                                    statusOptions.find(
                                        (status) =>
                                            status?.value ===
                                            selectedItem?.status
                                    ) || null
                                }
                                required
                            />
                        </div>

                        <div>
                            <button type="submit">
                                {loading ? (
                                    <Spinner />
                                ) : selectedItem ? (
                                    <span>Update</span>
                                ) : (
                                    <span>Publish</span>
                                )}
                            </button>
                        </div>
                    </form>
                </div>
            </Modal>

            {/* delete modal */}
            <Modal
                title="Permanently Delete"
                isOpen={isDeleteModalOpen}
                onClose={closeDeleteModal}
                width="max-w-md"
            >
                <div>
                    <p>
                        Are you sure you want to delete <br />
                        {selectedItem?.message} ?
                    </p>

                    <button type="button" onClick={closeDeleteModal}>
                        Cancel
                    </button>

                    <button type="button" onClick={handleDelete}>
                        {loading ? <Spinner /> : <span>Delete</span>}
                    </button>
                </div>
            </Modal>

            {/* delete selected modal */}
            <Modal
                title="Permanently Delete Selected Items"
                isOpen={isDeleteSelectedModalOpen}
                onClose={closeDeleteSelectedModal}
                width="max-w-md"
            >
                <div>
                    <p>Are you sure you want to delete selected items?</p>

                    <button type="button" onClick={closeDeleteSelectedModal}>
                        Cancel
                    </button>

                    <button type="button" onClick={handleBulkDelete}>
                        {loading ? <Spinner /> : <span>Delete</span>}
                    </button>
                </div>
            </Modal>

            {/* view modal */}
            <Modal
                title="Blog Details"
                isOpen={isViewModalOpen}
                onClose={closeViewModal}
                width="max-w-4xl"
            >
                {selectedItem && (
                    <div>
                        <div>
                            <h2>Id</h2>
                            <p>{selectedItem?._id}</p>
                        </div>

                        <div>
                            <h2>Message</h2>
                            <p>{selectedItem?.message}</p>
                        </div>

                        <div>
                            <h2>Seen by</h2>
                            <div>
                                {selectedItem?.seenBy?.map((user, index) => (
                                    <p key={user?._id}>
                                        {user.email}
                                        {index !==
                                            selectedItem.seenBy.length - 1 &&
                                            ", "}
                                        <br />
                                    </p>
                                ))}
                            </div>
                        </div>

                        <div>
                            <h2>specific users</h2>
                            <div>
                                {selectedItem?.specificUsers?.map(
                                    (user, index) => (
                                        <p key={user?._id}>
                                            {user.email}
                                            {index !==
                                                selectedItem.seenBy.length -
                                                    1 && ", "}
                                            <br />
                                        </p>
                                    )
                                )}
                            </div>
                        </div>

                        <div>
                            <h2>recipient roles</h2>
                            <div>
                                {selectedItem?.recipientRoles?.map(
                                    (role, index) => (
                                        <p key={index}>
                                            {role}
                                            {index !==
                                                selectedItem.recipientRoles
                                                    .length -
                                                    1 && ", "}
                                            <br />
                                        </p>
                                    )
                                )}
                            </div>
                        </div>

                        <div>
                            <h2>Target url</h2>
                            <p>{selectedItem?.targetUrl}</p>
                        </div>

                        <div>
                            <h2>Status</h2>
                            <p>{selectedItem?.status}</p>
                        </div>

                        <div>
                            <h2>Created</h2>
                            <p>{formatDateTime(selectedItem?.createdAt)}</p>
                        </div>

                        <div>
                            <h2>Updated</h2>
                            <p>{formatDateTime(selectedItem?.updatedAt)}</p>
                        </div>
                    </div>
                )}
            </Modal>
        </div>
    );
};

export default NotificationList;
