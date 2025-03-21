"use client";
import { useEffect, useState } from "react";
import { io } from "socket.io-client";
import { Edit, Trash2 } from "lucide-react";
import { toast } from "react-toastify";
import useCrud from "@/hooks/useCrud";
import Modal from "@/components/common/Modal";
import DownloadCSVButton from "@/components/common/DownloadCSVButton";
import Spinner from "@/components/common/Spinner";
import formatDateTime from "@/helpers/formatDateTime";
import fetchDataForClient from "@/helpers/fetchDataForClient";

const socket = io(process.env.NEXT_PUBLIC_API_URL);

const BlogCategoryList = ({ initialBlogCategories }) => {
    const [blogCategories, setBlogCategories] = useState(initialBlogCategories);

    const [search, setSearch] = useState("");
    const [sortBy, setSortBy] = useState("oldest");
    const [itemStatus, setItemStatus] = useState("all");
    const [startDate, setStartDate] = useState("");
    const [endDate, setEndDate] = useState("");
    const [filteredItems, setFilteredItems] = useState(blogCategories);
    const { createItem, updateItem, deleteItem, deleteMultipleItems, loading } =
        useCrud("blogCategories");

    const [isAddOrEditModalOpen, setIsAddOrEditModalOpen] = useState(false);
    const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
    const [isViewModalOpen, setIsViewModalOpen] = useState(false);
    const [selectedItem, setSelectedItem] = useState(null);
    const [selectedItems, setSelectedItems] = useState([]);
    const [selectAll, setSelectAll] = useState(false);

    // fetch updated data when the server sends a real-time update
    const refreshData = async () => {
        const updatedCategoriesResponse = await fetchDataForClient(
            `${process.env.NEXT_PUBLIC_API_URL}/api/blogCategories`
        );

        const updatedBlogCategories = updatedCategoriesResponse?.data || [];

        const updatedBlogCategoriesError =
            updatedCategoriesResponse?.error || null;

        if (updatedBlogCategoriesError) {
            const errorMessage = [updatedBlogCategoriesError]
                .filter(Boolean)
                .join("\n");

            toast.error(errorMessage);
        } else {
            setBlogCategories(updatedBlogCategories);
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

        const name = e.target.name.value.trim();
        const status = e.target.status.value.trim();

        if (selectedItem) {
            const response = await updateItem(selectedItem._id, {
                name,
                status,
            });

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
                closeAddOrEditModal();
            } else {
                toast.error(response);
            }
        } else {
            const response = await createItem({
                name,
                status,
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
    };

    // filtering logic
    useEffect(() => {
        let filtered = [...blogCategories];

        // search
        if (search) {
            const searchLower = search.toLowerCase();
            filtered = filtered.filter((item) =>
                [item?._id?.toString(), item?.name, item?.status]
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
                const blogDate = new Date(item?.createdAt).getTime();
                return (
                    blogDate >= new Date(startDate).getTime() &&
                    blogDate <= new Date(endDate).getTime()
                );
            });
        }

        setFilteredItems(filtered);
    }, [search, sortBy, itemStatus, startDate, endDate, blogCategories]);

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
                <h1>Blog Category List</h1>
                <h2>Total Blog Categories: {filteredItems.length}</h2>
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
                        placeholder="Search blog categories..."
                        value={search}
                        onChange={(e) => setSearch(e.target.value)}
                    />
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

                {/* filter by status */}
                <div>
                    <label htmlFor="status" className="">
                        Status
                    </label>

                    <select
                        name="status"
                        id="status"
                        className=""
                        value={itemStatus}
                        onChange={(e) => setItemStatus(e.target.value)}
                    >
                        <option value="all">All</option>
                        <option value="active">Active</option>
                        <option value="inactive">Inactive</option>
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
                    data={blogCategories}
                    filename="blog-categories.csv"
                    selectedColumns={[
                        "_id",
                        "name",
                        "slug",
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

                            <th>Name</th>

                            <th>Slug</th>

                            <th>Status</th>

                            <th>Created</th>

                            <th>Updated</th>

                            <th>Actions</th>
                        </tr>
                    </thead>

                    <tbody>
                        {filteredItems.length === 0 ? (
                            <tr>
                                <td colSpan="9" className="text-center">
                                    No blog categories found.
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
                                            {item?.name}
                                        </span>
                                    </td>

                                    <td>{item?.slug}</td>

                                    <td>{item?.status}</td>

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
                title={
                    selectedItem
                        ? "Edit Blog Category"
                        : "Add New Blog Category"
                }
                isOpen={isAddOrEditModalOpen}
                onClose={closeAddOrEditModal}
                width="max-w-4xl"
            >
                <div>
                    <form onSubmit={handleSave}>
                        <div>
                            <label htmlFor="name" className="">
                                Name
                            </label>

                            <input
                                type="text"
                                name="name"
                                id="name"
                                autoComplete="off"
                                className=""
                                placeholder="Enter name"
                                defaultValue={selectedItem?.name || ""}
                                required
                            />
                        </div>

                        <div>
                            <label htmlFor="status" className="">
                                Status
                            </label>

                            <select
                                name="status"
                                id="status"
                                className=""
                                defaultValue={selectedItem?.status || ""}
                                required
                            >
                                <option value="" disabled>
                                    Select a status
                                </option>
                                <option value="active">Active</option>
                                <option value="inactive">Inactive</option>
                            </select>
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
                        {selectedItem?.name} ?
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
                title="Blog Category Details"
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
                            <h2>Name</h2>
                            <p>{selectedItem?.name}</p>
                        </div>

                        <div>
                            <h2>Slug</h2>
                            <p>{selectedItem?.slug}</p>
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

export default BlogCategoryList;
