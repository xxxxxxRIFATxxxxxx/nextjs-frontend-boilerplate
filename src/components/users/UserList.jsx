"use client";
import { useEffect, useRef, useState } from "react";
import Image from "next/image";
import { io } from "socket.io-client";
import { Edit, Trash2 } from "lucide-react";
import { toast } from "react-toastify";
import Select from "react-select";
import useCrud from "@/hooks/useCrud";
import Modal from "@/components/common/Modal";
import TextEditor from "@/components/common/TextEditor";
import DownloadCSVButton from "@/components/common/DownloadCSVButton";
import Spinner from "@/components/common/Spinner";
import DefaultUserIcon from "@/components/common/DefaultUserIcon";
import formatDateTime from "@/helpers/formatDateTime";
import formatDate from "@/helpers/formatDate";
import uploadSingleFile from "@/helpers/uploadSingleFile";
import fetchDataForClient from "@/helpers/fetchDataForClient";

const socket = io(process.env.NEXT_PUBLIC_API_URL);

const UserList = ({ initialUsers }) => {
    const [users, setUsers] = useState(initialUsers);

    const [search, setSearch] = useState("");
    const [sortBy, setSortBy] = useState("oldest");
    const [itemStatus, setItemStatus] = useState("all");
    const [startDate, setStartDate] = useState("");
    const [endDate, setEndDate] = useState("");
    const [filteredItems, setFilteredItems] = useState(users);
    const { createItem, updateItem, deleteItem, deleteMultipleItems, loading } =
        useCrud("users");

    const [isAddOrEditModalOpen, setIsAddOrEditModalOpen] = useState(false);
    const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
    const [isViewModalOpen, setIsViewModalOpen] = useState(false);
    const [selectedItem, setSelectedItem] = useState(null);
    const [selectedItems, setSelectedItems] = useState([]);
    const [selectAll, setSelectAll] = useState(false);
    const [bio, setBio] = useState("");
    const [userImage, setUserImage] = useState(null);
    const userImageRef = useRef(null);
    const [role, setRole] = useState(null);
    const roleOptions = [
        { label: "Super Admin", value: "super_admin" },
        { label: "Admin", value: "admin" },
        { label: "Moderator", value: "moderator" },
        { label: "User", value: "user" },
    ];
    const [status, setStatus] = useState(null);
    const statusOptions = [
        { label: "Active", value: "active" },
        { label: "Inactive", value: "inactive" },
        { label: "Banned", value: "banned" },
    ];

    // fetch updated data when the server sends a real-time update
    const refreshData = async () => {
        const updatedUsersResponse = await fetchDataForClient(
            `${process.env.NEXT_PUBLIC_API_URL}/api/users`
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

    // handle item creation or update
    const handleSave = async (e) => {
        e.preventDefault();

        const fullName = e.target.fullName.value.trim();
        const email = e.target.email.value.trim();
        const phone = e.target.phone.value.trim();
        const username = e.target.username.value.trim();
        const password = e.target.password.value.trim();
        const roleValue = role?.value;
        const statusValue = status?.value;
        const image = e.target.image.files[0];
        const dateOfBirth = e.target.dateOfBirth.value
            ? new Date(e.target.dateOfBirth.value)
            : null;
        const street = e.target.street.value.trim() || null;
        const city = e.target.city.value.trim() || null;
        const state = e.target.state.value.trim() || null;
        const zipCode = e.target.zipCode.value.trim() || null;
        const country = e.target.country.value.trim() || null;

        let imageUrl = selectedItem?.image;

        if (image) {
            const responseFile = await uploadSingleFile(image);

            if (responseFile?.error) {
                return toast.error(responseFile.error);
            } else {
                imageUrl = responseFile.data.fileUrl;
            }
        }

        const userData = {
            fullName,
            email,
            phone,
            username,
            role: roleValue,
            status: statusValue,
            image: imageUrl,
            dateOfBirth,
            address: { street, city, state, zipCode, country },
            bio,
        };

        if (password) {
            userData.password = password;
        }

        if (selectedItem) {
            const response = await updateItem(selectedItem._id, userData);

            if (response?.data) {
                const updatedItem = response?.data;

                setFilteredItems((prev) =>
                    prev.map((item) =>
                        item._id === selectedItem._id
                            ? {
                                  ...updatedItem,
                              }
                            : item
                    )
                );
                toast.success(response?.message);
                setBio("");
                closeAddOrEditModal();
            } else {
                toast.error(response);
            }
        } else {
            const response = await createItem(userData);

            if (response?.data) {
                const newItem = response?.data;

                setFilteredItems((prev) => [
                    ...prev,
                    {
                        ...newItem,
                    },
                ]);

                toast.success(response?.message);
                setBio("");
                closeAddOrEditModal();
            } else {
                toast.error(response);
            }
        }
    };

    // handle item deletion
    const handleDelete = async () => {
        const response = await deleteItem(selectedItem._id);

        if (response?.message) {
            setFilteredItems((prev) =>
                prev.filter((item) => item._id !== selectedItem._id)
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
            selectAll ? [] : filteredItems.map((item) => item._id)
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
                prev.filter((item) => !selectedItems.includes(item._id))
            );
            toast.success(response?.message);
            setSelectedItems([]);
            setSelectAll(false);
        } else {
            toast.error(response);
        }
    };

    // for remove exixting items
    const removeExixtingItems = () => {
        setSelectedItem(null);
        setRole(null);
        setStatus(null);
        setUserImage(null);
    };

    // for preview user image
    const handleUserImageChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            setUserImage(file);
        }
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
                    item?.status,
                ]
                    .map((field) => field?.toLowerCase() ?? "")
                    .some((field) => field?.includes(searchLower))
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

        // filter by status
        if (itemStatus !== "all") {
            filtered = filtered.filter((item) => item.status === itemStatus);
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
    }, [search, sortBy, itemStatus, startDate, endDate, users]);

    // update state when selectedItem changes
    useEffect(() => {
        setRole(
            roleOptions.find((option) => option.value === selectedItem?.role) ||
                null
        );

        setStatus(
            statusOptions.find(
                (option) => option.value === selectedItem?.status
            ) || null
        );

        setBio(selectedItem?.bio || "");
    }, [selectedItem]);

    // listen for real-time events and update ui
    useEffect(() => {
        socket.on("usersUpdated", refreshData);

        return () => {
            socket.off("usersUpdated", refreshData);
        };
    }, []);

    return (
        <div>
            <div>
                <h1>User List</h1>
                <h2>Total Users: {filteredItems.length}</h2>
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
                            setSortBy(selectedOption.value)
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
                            { label: "Banned", value: "banned" },
                        ]}
                        onChange={(selectedOption) =>
                            setItemStatus(selectedOption.value)
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
                                              : itemStatus === "inactive"
                                              ? "Inactive"
                                              : "Banned",
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
                        <button type="button" onClick={handleBulkDelete}>
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
                    filename="users.csv"
                    selectedColumns={[
                        "_id",
                        "fullName",
                        "email",
                        "phone",
                        "username",
                        "password",
                        "role",
                        "status",
                        "image",
                        "dateOfBirth",
                        "address_street",
                        "address_city",
                        "address_state",
                        "address_zipCode",
                        "address_country",
                        "lastLogin",
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

                            <th>Image</th>

                            <th>Id</th>

                            <th>Full name</th>

                            <th>Email</th>

                            <th>Phone</th>

                            <th>Username</th>

                            <th>Role</th>

                            <th>Status</th>

                            <th>Date of birth</th>

                            <th>Last login</th>

                            <th>Created</th>

                            <th>Updated</th>

                            <th>Actions</th>
                        </tr>
                    </thead>

                    <tbody>
                        {filteredItems.length === 0 ? (
                            <tr>
                                <td colSpan="15" className="text-center">
                                    No users found.
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
                                    </td>

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
                                            {item?.fullName}
                                        </span>
                                    </td>

                                    <td>{item?.email}</td>

                                    <td>{item?.phone}</td>

                                    <td>{item?.username}</td>

                                    <td>{item?.role}</td>

                                    <td>{item?.status}</td>

                                    <td>
                                        {item?.dateOfBirth ? (
                                            <span>
                                                {formatDate(item?.dateOfBirth)}
                                            </span>
                                        ) : (
                                            <span>-</span>
                                        )}
                                    </td>

                                    <td>
                                        {item?.lastLogin ? (
                                            <span>
                                                {formatDateTime(
                                                    item?.lastLogin
                                                )}
                                            </span>
                                        ) : (
                                            <span>-</span>
                                        )}
                                    </td>

                                    <td>{formatDateTime(item?.createdAt)}</td>

                                    <td>{formatDateTime(item?.updatedAt)}</td>

                                    <td className="p-[18px] relative">
                                        <button
                                            type="button"
                                            onClick={() =>
                                                openAddOrEditModal(item)
                                            }
                                        >
                                            <Edit className="w-4 h-4" />
                                        </button>

                                        <button
                                            type="button"
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
                title={selectedItem ? "Edit User" : "Add New User"}
                isOpen={isAddOrEditModalOpen}
                onClose={closeAddOrEditModal}
                width="max-w-4xl"
            >
                <div>
                    <form onSubmit={handleSave}>
                        <div>
                            <label htmlFor="fullName" className="">
                                Full Name
                            </label>

                            <input
                                type="text"
                                name="fullName"
                                id="fullName"
                                autoComplete="off"
                                className=""
                                placeholder="Enter full name"
                                defaultValue={selectedItem?.fullName || ""}
                                required
                            />
                        </div>

                        <div>
                            <label htmlFor="email">Email</label>

                            <input
                                type="email"
                                name="email"
                                id="email"
                                autoComplete="email"
                                className=""
                                placeholder="Enter email"
                                defaultValue={selectedItem?.email || ""}
                                required
                            />
                        </div>

                        <div>
                            <label htmlFor="phone">Phone</label>

                            <input
                                type="tel"
                                name="phone"
                                id="phone"
                                autoComplete="tel"
                                className=""
                                placeholder="Enter phone number"
                                defaultValue={selectedItem?.phone || ""}
                                required
                            />
                        </div>

                        <div>
                            <label htmlFor="username">Username</label>

                            <input
                                type="text"
                                name="username"
                                id="username"
                                autoComplete="username"
                                className=""
                                placeholder="Enter username"
                                defaultValue={selectedItem?.username || ""}
                                required
                            />
                        </div>

                        <div>
                            <label htmlFor="password">Password</label>

                            <input
                                type="password"
                                name="password"
                                id="password"
                                autoComplete="new-password"
                                className=""
                                placeholder="••••••••"
                            />
                        </div>

                        <div>
                            <span className="">Role</span>

                            <Select
                                options={roleOptions}
                                onChange={setRole}
                                className=""
                                placeholder="Select role"
                                defaultValue={
                                    roleOptions.find(
                                        (role) =>
                                            role.value === selectedItem?.role
                                    ) || null
                                }
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
                                            status.value ===
                                            selectedItem?.status
                                    ) || null
                                }
                            />
                        </div>

                        <div>
                            <label htmlFor="image" className="">
                                Image
                            </label>

                            {userImage || selectedItem?.image ? (
                                <Image
                                    src={
                                        userImage
                                            ? URL.createObjectURL(userImage)
                                            : selectedItem?.image
                                    }
                                    className="w-[200px] h-[200px] object-cover rounded-full cursor-pointer"
                                    width={200}
                                    height={200}
                                    alt="user image"
                                    onClick={() => userImageRef.current.click()}
                                />
                            ) : (
                                <DefaultUserIcon
                                    width="w-[200px]"
                                    height="h-[200px]"
                                    iconSize={100}
                                    onClick={() => userImageRef.current.click()}
                                />
                            )}

                            <input
                                type="file"
                                name="image"
                                id="image"
                                className=""
                                accept="image/*"
                                onChange={handleUserImageChange}
                                ref={userImageRef}
                            />
                        </div>

                        <div>
                            <label htmlFor="dateOfBirth">Date of Birth</label>

                            <input
                                type="date"
                                name="dateOfBirth"
                                id="dateOfBirth"
                                autoComplete="bday"
                                className=""
                                defaultValue={
                                    selectedItem?.dateOfBirth
                                        ? new Date(selectedItem?.dateOfBirth)
                                              .toISOString()
                                              .split("T")[0]
                                        : ""
                                }
                            />
                        </div>

                        <div>
                            <label htmlFor="street">Street</label>

                            <input
                                type="text"
                                name="street"
                                id="street"
                                autoComplete="street-address"
                                className=""
                                placeholder="Enter street"
                                defaultValue={
                                    selectedItem?.address?.street || ""
                                }
                            />
                        </div>

                        <div>
                            <label htmlFor="city">City</label>

                            <input
                                type="text"
                                name="city"
                                id="city"
                                autoComplete="address-level2"
                                className=""
                                placeholder="Enter city"
                                defaultValue={selectedItem?.address?.city || ""}
                            />
                        </div>

                        <div>
                            <label htmlFor="state">State</label>

                            <input
                                type="text"
                                name="state"
                                id="state"
                                autoComplete="address-level1"
                                className=""
                                placeholder="Enter state"
                                defaultValue={
                                    selectedItem?.address?.state || ""
                                }
                            />
                        </div>

                        <div>
                            <label htmlFor="zipCode">Zip Code</label>

                            <input
                                type="text"
                                name="zipCode"
                                id="zipCode"
                                autoComplete="postal-code"
                                className=""
                                placeholder="Enter zip code"
                                defaultValue={
                                    selectedItem?.address?.zipCode || ""
                                }
                            />
                        </div>

                        <div>
                            <label htmlFor="country">Country</label>

                            <input
                                type="text"
                                name="country"
                                id="country"
                                autoComplete="country"
                                className=""
                                placeholder="Enter country"
                                defaultValue={
                                    selectedItem?.address?.country || ""
                                }
                            />
                        </div>

                        <div>
                            <span className="">Bio</span>

                            <TextEditor
                                onChange={setBio}
                                content={selectedItem?.bio}
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
                        {selectedItem?.fullName} ?
                    </p>

                    <button type="button" onClick={closeDeleteModal}>
                        Cancel
                    </button>

                    <button type="button" onClick={handleDelete}>
                        {loading ? <Spinner /> : <span>Delete</span>}
                    </button>
                </div>
            </Modal>

            {/* view modal */}
            <Modal
                title="User Details"
                isOpen={isViewModalOpen}
                onClose={closeViewModal}
                width="max-w-4xl"
            >
                {selectedItem && (
                    <div>
                        <div>
                            <h2>Image</h2>

                            {selectedItem?.image ? (
                                <Image
                                    src={selectedItem?.image}
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

                        <div>
                            <h2>Id</h2>
                            <p>{selectedItem?._id}</p>
                        </div>

                        <div>
                            <h2>Full name</h2>
                            <p>{selectedItem?.fullName}</p>
                        </div>

                        <div>
                            <h2>Email</h2>
                            <p>{selectedItem?.email}</p>
                        </div>

                        <div>
                            <h2>Phone</h2>
                            <p>{selectedItem?.phone}</p>
                        </div>

                        <div>
                            <h2>Username</h2>
                            <p>{selectedItem?.username}</p>
                        </div>

                        <div>
                            <h2>Role</h2>
                            <p>{selectedItem?.role}</p>
                        </div>

                        <div>
                            <h2>Status</h2>
                            <p>{selectedItem?.status}</p>
                        </div>

                        <div>
                            <h2>Date of birth</h2>
                            {selectedItem?.dateOfBirth && (
                                <p>{formatDate(selectedItem?.dateOfBirth)}</p>
                            )}
                        </div>

                        <div>
                            <h2>Address</h2>
                            <p>Street: {selectedItem?.address?.street}</p>
                            <p>City: {selectedItem?.address?.city}</p>
                            <p>State: {selectedItem?.address?.state}</p>
                            <p>Zip code: {selectedItem?.address?.zipCode}</p>
                            <p>Country: {selectedItem?.address?.country}</p>
                        </div>

                        <div>
                            <h2>Bio</h2>
                            <div
                                dangerouslySetInnerHTML={{
                                    __html: selectedItem?.bio,
                                }}
                            ></div>
                        </div>

                        <div>
                            <h2>Last login</h2>
                            <p>{formatDateTime(selectedItem?.lastLogin)}</p>
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

export default UserList;
