"use client";
import { useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { Edit, Eye, Trash2, X } from "lucide-react";
import { toast } from "react-toastify";
import Select from "react-select";
import useCrud from "@/hooks/useCrud";
import Modal from "@/components/common/Modal";
import DownloadCSVButton from "@/components/common/DownloadCSVButton";
import Spinner from "@/components/common/Spinner";
import RoleBasedComponent from "@/components/common/RoleBasedComponent";
import DefaultFile from "@/components/common/DefaultFile";
import { useSocket } from "@/context/SocketProvider";
import formatDateTime from "@/helpers/formatDateTime";
import uploadMultipleFiles from "@/helpers/uploadMultipleFiles";
import fetchDataForClient from "@/helpers/fetchDataForClient";
import downloadAllFiles from "@/helpers/downloadAllFiles";
import deleteAllFiles from "@/helpers/deleteAllFiles";

const AdminFileList = ({ initialFiles }) => {
    const router = useRouter();
    const socket = useSocket();

    const [files, setFiles] = useState(initialFiles);

    const [search, setSearch] = useState("");
    const [sortBy, setSortBy] = useState("oldest");
    const [itemStatus, setItemStatus] = useState("all");
    const [startDate, setStartDate] = useState("");
    const [endDate, setEndDate] = useState("");
    const [filteredItems, setFilteredItems] = useState(files);
    const { createItem, updateItem, deleteItem, deleteMultipleItems, loading } =
        useCrud("files");

    const [isAddOrEditModalOpen, setIsAddOrEditModalOpen] = useState(false);
    const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
    const [isDeleteSelectedModalOpen, setIsDeleteSelectedModalOpen] =
        useState(false);
    const [isViewModalOpen, setIsViewModalOpen] = useState(false);
    const [selectedItem, setSelectedItem] = useState(null);
    const [selectedItems, setSelectedItems] = useState([]);
    const [selectAll, setSelectAll] = useState(false);
    const [multipleFiles, setMultipleFiles] = useState([]);
    const multipleFilesRef = useRef(null);
    const [status, setStatus] = useState(null);
    const statusOptions = [
        { label: "Active", value: "active" },
        { label: "Inactive", value: "inactive" },
    ];

    // for delete all files
    const [deleteAllFilesLoading, setDeleteAllFilesLoading] = useState(false);
    const [isDeleteAllFilesModalOpen, setIsDeleteAllFilesModalOpen] =
        useState(false);

    const handleDeleteAllFiles = async () => {
        setDeleteAllFilesLoading(true);

        const response = await deleteAllFiles();

        if (response?.error) {
            toast.error(response?.error);
        } else {
            toast.success(response?.message);
        }

        setDeleteAllFilesLoading(false);
        setIsDeleteAllFilesModalOpen(false);
    };

    // open delete all files confirmation modal
    const openDeleteAllFilesModal = (item) => {
        setIsDeleteAllFilesModalOpen(true);
    };

    // close delete all files confirmation modal
    const closeDeleteAllFilesModal = () => {
        setIsDeleteSelectedModalOpen(false);
    };

    // fetch updated data when the server sends a real-time update
    const refreshData = async () => {
        // files
        const updatedFilesResponse = await fetchDataForClient(
            `${process.env.NEXT_PUBLIC_API_URL}/api/files`
        );
        const updatedFiles = updatedFilesResponse?.data || [];
        const updatedFilesError = updatedFilesResponse?.error || null;

        if (updatedFilesError) {
            const errorMessage = [updatedFilesError].filter(Boolean).join("\n");

            toast.error(errorMessage);
        } else {
            setFiles(updatedFiles);
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

        const title = e.target.title.value.trim();
        const statusValue = status?.value;

        let multipleFileUrls = multipleFiles;

        if (multipleFiles.length > 0) {
            const files = multipleFiles.filter((file) => file instanceof File);
            const urls = multipleFiles.filter(
                (file) => typeof file === "string"
            );

            if (files.length > 0) {
                const responseFiles = await uploadMultipleFiles(files);
                if (responseFiles?.error) {
                    return toast.error(responseFiles?.error);
                } else {
                    multipleFileUrls = [
                        ...urls,
                        ...responseFiles?.data?.fileUrls,
                    ];
                }
            }
        }

        if (selectedItem) {
            const response = await updateItem(selectedItem?._id, {
                title,
                files: multipleFileUrls,
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
                title,
                files: multipleFileUrls,
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
        setMultipleFiles([]);
        setStatus(null);
    };

    // for preview multiple files
    const handleMultipleFilesChange = (e) => {
        if (!e.target.files) return;
        const files = Array.from(e.target.files);
        setMultipleFiles((prevFiles) => [...(prevFiles || []), ...files]);
    };

    // for drag and drop multiple files
    const handleMultipleFilesDrop = (e) => {
        e.preventDefault();
        const files = Array.from(e.dataTransfer.files);
        if (files.length > 0) {
            setMultipleFiles((prevFiles) => [...(prevFiles || []), ...files]);
        }
    };

    // remove an file from preview
    const removeFileFromPreview = (index) => {
        setMultipleFiles(multipleFiles.filter((_, i) => i !== index));
    };

    // navigate to the item details page
    const goToItemDetails = (item) => {
        router.push(`/admin/files/${item?._id}`);
    };

    // filtering logic
    useEffect(() => {
        let filtered = [...files];

        // search
        if (search) {
            const searchLower = search.toLowerCase();
            filtered = filtered.filter((item) =>
                [item?._id?.toString(), item?.title, item?.status]
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
    }, [search, sortBy, itemStatus, startDate, endDate, files]);

    // update state when selectedItem changes
    useEffect(() => {
        setMultipleFiles(selectedItem?.files || []);

        setStatus(
            statusOptions.find(
                (option) => option?.value === selectedItem?.status
            ) || null
        );
    }, [selectedItem]);

    // listen for real-time events and update ui
    useEffect(() => {
        if (!socket) return;

        socket.on("filesUpdated", refreshData);

        return () => {
            socket.off("filesUpdated", refreshData);
        };
    }, [socket]);

    return (
        <section>
            <div>
                <h1>File list</h1>
                <h2>Total liles: {filteredItems?.length}</h2>
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
                        placeholder="Search files..."
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

                {/* delete selected button */}
                <RoleBasedComponent allowedRoles={["super_admin", "admin"]}>
                    <div>
                        {selectedItems.length > 0 && (
                            <button
                                type="button"
                                onClick={openDeleteSelectedModal}
                            >
                                Delete selected
                            </button>
                        )}
                    </div>
                </RoleBasedComponent>

                {/* add item button */}
                <div>
                    <button type="button" onClick={() => openAddOrEditModal()}>
                        Add new
                    </button>
                </div>

                {/* download csv button */}
                <DownloadCSVButton
                    data={filteredItems}
                    filename="files.csv"
                    selectedColumns={[
                        "_id",
                        "title",
                        "files",
                        "status",
                        "createdAt",
                        "updatedAt",
                    ]}
                />

                {/* download all files */}
                <button onClick={downloadAllFiles}>Download all files</button>

                {/* delete all files */}
                {/* <button onClick={openDeleteAllFilesModal}>
                    Delete all files
                </button> */}
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

                            <th>Title</th>

                            <th>Files</th>

                            <th>Status</th>

                            <th>Created</th>

                            <th>Updated</th>

                            <th>Actions</th>
                        </tr>
                    </thead>

                    <tbody>
                        {filteredItems?.length === 0 ? (
                            <tr>
                                <td colSpan="9" className="text-center">
                                    No files found.
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
                                            onClick={() =>
                                                goToItemDetails(item)
                                            }
                                        >
                                            {item?._id}
                                        </span>
                                    </td>

                                    <td>
                                        <span
                                            className="hover:underline cursor-pointer"
                                            onClick={() =>
                                                goToItemDetails(item)
                                            }
                                        >
                                            {item?.title}
                                        </span>
                                    </td>

                                    <td className="grid grid-cols-1">
                                        {item?.files?.map((file, index) => (
                                            <Link
                                                key={index}
                                                href={file}
                                                className="hover:underline"
                                                target="_blank"
                                            >
                                                {file}
                                            </Link>
                                        ))}
                                    </td>

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

                                        <RoleBasedComponent
                                            allowedRoles={[
                                                "super_admin",
                                                "admin",
                                            ]}
                                        >
                                            <button
                                                type="button"
                                                className="cursor-pointer"
                                                onClick={() =>
                                                    openDeleteModal(item)
                                                }
                                            >
                                                <Trash2 className="w-4 h-4" />
                                            </button>
                                        </RoleBasedComponent>
                                    </td>
                                </tr>
                            ))
                        )}
                    </tbody>
                </table>
            </div>

            {/* add or edit modal */}
            <Modal
                title={selectedItem ? "Edit files" : "Upload new files"}
                isOpen={isAddOrEditModalOpen}
                onClose={closeAddOrEditModal}
                width="max-w-4xl"
            >
                <div>
                    <form onSubmit={handleSave}>
                        <div>
                            <label htmlFor="title" className="">
                                Title
                            </label>

                            <input
                                type="text"
                                name="title"
                                id="title"
                                autoComplete="off"
                                className=""
                                placeholder="Enter title"
                                defaultValue={selectedItem?.title || ""}
                                required
                            />
                        </div>

                        <div>
                            <label htmlFor="files" className="">
                                Files
                            </label>

                            {multipleFiles?.length > 0 && (
                                <div className="grid grid-cols-1 gap-2">
                                    {multipleFiles?.map((file, index) => (
                                        <div
                                            key={index}
                                            className="flex items-center justify-between"
                                        >
                                            <Link
                                                href={
                                                    file instanceof File
                                                        ? URL.createObjectURL(
                                                              file
                                                          )
                                                        : file
                                                }
                                                className="hover:underline"
                                                target="_blank"
                                            >
                                                {file instanceof File
                                                    ? file?.name
                                                    : file}
                                            </Link>

                                            <button
                                                className="bg-red-500 text-white p-1 rounded-full cursor-pointer "
                                                onClick={(e) => {
                                                    e.preventDefault();
                                                    e.stopPropagation();
                                                    removeFileFromPreview(
                                                        index
                                                    );
                                                }}
                                            >
                                                <X className="w-4 h-4" />
                                            </button>
                                        </div>
                                    ))}
                                </div>
                            )}

                            <DefaultFile
                                width="w-full"
                                height="h-[400px]"
                                iconSize={100}
                                onClick={() => multipleFilesRef.current.click()}
                                onDragOver={(e) => e.preventDefault()}
                                onDrop={handleMultipleFilesDrop}
                            />

                            <input
                                type="file"
                                name="files"
                                id="files"
                                className=""
                                onChange={handleMultipleFilesChange}
                                ref={multipleFilesRef}
                                multiple
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
                            <button
                                type="submit"
                                className="disabled:cursor-not-allowed disabled:opacity-50"
                                disabled={loading}
                            >
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
                title="Permanently delete"
                isOpen={isDeleteModalOpen}
                onClose={closeDeleteModal}
                width="max-w-md"
            >
                <div>
                    <p>
                        Are you sure you want to delete <br />
                        {selectedItem?.title} ?
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
                title="Permanently delete selected items"
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

            {/* delete all files modal */}
            <Modal
                title="Permanently delete all files"
                isOpen={isDeleteAllFilesModalOpen}
                onClose={closeDeleteAllFilesModal}
                width="max-w-md"
            >
                <div>
                    <p>Are you sure you want to delete all files?</p>

                    <button type="button" onClick={closeDeleteAllFilesModal}>
                        Cancel
                    </button>

                    <button type="button" onClick={handleDeleteAllFiles}>
                        {deleteAllFilesLoading ? (
                            <Spinner />
                        ) : (
                            <span>Delete</span>
                        )}
                    </button>
                </div>
            </Modal>

            {/* view modal */}
            <Modal
                title="File details"
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
                            <h2>Title</h2>
                            <p>{selectedItem?.title}</p>
                        </div>

                        <div>
                            <h2>Files</h2>
                            <div className="grid grid-cols-1">
                                {selectedItem?.files?.map((file, index) => (
                                    <Link
                                        key={index}
                                        href={file}
                                        className="hover:underline"
                                        target="_blank"
                                    >
                                        {file}
                                    </Link>
                                ))}
                            </div>
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
        </section>
    );
};

export default AdminFileList;
