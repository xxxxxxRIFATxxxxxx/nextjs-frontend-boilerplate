"use client";
import { useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import { Edit, Eye, Trash2, X } from "lucide-react";
import { toast } from "react-toastify";
import Select from "react-select";
import useCrud from "@/hooks/useCrud";
import Modal from "@/components/common/Modal";
import TextEditor from "@/components/common/TextEditor";
import DownloadCSVButton from "@/components/common/DownloadCSVButton";
import Spinner from "@/components/common/Spinner";
import RoleBasedComponent from "@/components/common/RoleBasedComponent";
import DefaultFile from "@/components/common/DefaultFile";
import { useSocket } from "@/context/SocketProvider";
import formatDateTime from "@/helpers/formatDateTime";
import uploadSingleFile from "@/helpers/uploadSingleFile";
import uploadMultipleFiles from "@/helpers/uploadMultipleFiles";
import fetchDataForClient from "@/helpers/fetchDataForClient";

const AdminBlogList = ({
    initialBlogs,
    initialBlogCategories,
    initialUsers,
}) => {
    const router = useRouter();
    const socket = useSocket();

    const [blogs, setBlogs] = useState(initialBlogs);
    const [blogCategories, setBlogCategories] = useState(initialBlogCategories);
    const [users, setUsers] = useState(initialUsers);

    const [search, setSearch] = useState("");
    const [sortBy, setSortBy] = useState("oldest");
    const [itemStatus, setItemStatus] = useState("all");
    const [startDate, setStartDate] = useState("");
    const [endDate, setEndDate] = useState("");
    const [filteredItems, setFilteredItems] = useState(blogs);
    const { createItem, updateItem, deleteItem, deleteMultipleItems, loading } =
        useCrud("blogs");

    const [isAddOrEditModalOpen, setIsAddOrEditModalOpen] = useState(false);
    const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
    const [isDeleteSelectedModalOpen, setIsDeleteSelectedModalOpen] =
        useState(false);
    const [isViewModalOpen, setIsViewModalOpen] = useState(false);
    const [selectedItem, setSelectedItem] = useState(null);
    const [selectedItems, setSelectedItems] = useState([]);
    const [selectAll, setSelectAll] = useState(false);
    const [category, setCategory] = useState(null);
    const [createdBy, setCreatedBy] = useState(null);
    const [description, setDescription] = useState("");
    const [thumbnailImage, setThumbnailImage] = useState(null);
    const [coverImage, setCoverImage] = useState(null);
    const [images, setImages] = useState([]);
    const thumbnailImageRef = useRef(null);
    const coverImageRef = useRef(null);
    const imagesRef = useRef(null);
    const [status, setStatus] = useState(null);
    const statusOptions = [
        { label: "Active", value: "active" },
        { label: "Inactive", value: "inactive" },
    ];

    // fetch updated data when the server sends a real-time update
    const refreshData = async () => {
        // blogs
        const updatedBlogsResponse = await fetchDataForClient(
            `${process.env.NEXT_PUBLIC_API_URL}/api/blogs`
        );
        const updatedBlogs = updatedBlogsResponse?.data || [];
        const updatedBlogsError = updatedBlogsResponse?.error || null;

        // blog categories
        const updatedBlogCategoriesResponse = await fetchDataForClient(
            `${process.env.NEXT_PUBLIC_API_URL}/api/blogCategories`
        );
        const updatedBlogCategories = updatedBlogCategoriesResponse?.data || [];
        const updatedBlogCategoriesError =
            updatedBlogCategoriesResponse?.error || null;

        // users
        const updatedUsersResponse = await fetchDataForClient(
            `${process.env.NEXT_PUBLIC_API_URL}/api/users`
        );
        const updatedUsers = updatedUsersResponse?.data || [];
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
        const categoryId = category?.value;
        const createdById = createdBy?.value;
        const statusValue = status?.value;

        let thumbnailUrl = selectedItem?.thumbnail;

        if (thumbnailImage) {
            const responseFile = await uploadSingleFile(thumbnailImage);

            if (responseFile?.error) {
                return toast.error(responseFile?.error);
            } else {
                thumbnailUrl = responseFile?.data?.fileUrl;
            }
        }

        let coverImageUrl = selectedItem?.coverImage;

        if (coverImage) {
            const responseFile = await uploadSingleFile(coverImage);

            if (responseFile?.error) {
                return toast.error(responseFile?.error);
            } else {
                coverImageUrl = responseFile?.data?.fileUrl;
            }
        }

        let imageUrls = images;

        if (images.length > 0) {
            const files = images.filter((image) => image instanceof File);
            const urls = images.filter((image) => typeof image === "string");

            if (files.length > 0) {
                const responseFiles = await uploadMultipleFiles(files);
                if (responseFiles?.error) {
                    return toast.error(responseFiles?.error);
                } else {
                    imageUrls = [...urls, ...responseFiles?.data?.fileUrls];
                }
            }
        }

        if (selectedItem) {
            const response = await updateItem(selectedItem?._id, {
                title,
                description,
                category: categoryId,
                thumbnail: thumbnailUrl,
                coverImage: coverImageUrl,
                images: imageUrls,
                createdBy: createdById,
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
                description,
                category: categoryId,
                thumbnail: thumbnailUrl,
                coverImage: coverImageUrl,
                images: imageUrls,
                createdBy: createdById,
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
        setDescription("");
        setSelectedItem(null);
        setCategory(null);
        setThumbnailImage(null);
        setCoverImage(null);
        setImages([]);
        setCreatedBy(null);
        setStatus(null);
    };

    // for preview thumbnail image
    const handleThumbnailImageChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            setThumbnailImage(file);
        }
    };

    // for drag and drop thumbnail image
    const handleThumbnailImageDrop = (e) => {
        e.preventDefault();
        const file = e.dataTransfer.files[0];
        if (file) {
            setThumbnailImage(file);
        }
    };

    // for preview cover image
    const handleCoverImageChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            setCoverImage(file);
        }
    };

    // for drag and drop cover image
    const handleCoverImageDrop = (e) => {
        e.preventDefault();
        const file = e.dataTransfer.files[0];
        if (file) {
            setCoverImage(file);
        }
    };

    // for preview images
    const handleImagesChange = (e) => {
        if (!e.target.files) return;
        const files = Array.from(e.target.files);
        setImages((prevImages) => [...(prevImages || []), ...files]);
    };

    // for drag and drop images
    const handleImagesDrop = (e) => {
        e.preventDefault();
        const files = Array.from(e.dataTransfer.files);
        if (files.length > 0) {
            setImages((prevImages) => [...(prevImages || []), ...files]);
        }
    };

    // remove an image from preview
    const removeImageFromPreview = (index) => {
        setImages(images.filter((_, i) => i !== index));
    };

    // navigate to the item details page
    const goToItemDetails = (item) => {
        router.push(`/admin/blogs/${item?.slug}`);
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
                    item?.slug,
                    item?.category?.title,
                    item?.status,
                    item?.createdBy?.fullName,
                    item?.createdBy?.email,
                    item?.createdBy?.phone,
                    item?.createdBy?.username,
                    item?.createdBy?.role,
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
    }, [search, sortBy, itemStatus, startDate, endDate, blogs]);

    // update state when selectedItem changes
    useEffect(() => {
        setCategory(
            blogCategories.find(
                (blogCategory) =>
                    blogCategory?._id === selectedItem?.category?._id
            )
                ? {
                      label: selectedItem?.category?.title,
                      value: selectedItem?.category?._id,
                  }
                : null
        );

        setImages(selectedItem?.images);

        setCreatedBy(
            users.find((user) => user?._id === selectedItem?.createdBy?._id)
                ? {
                      label: selectedItem?.createdBy?.email,
                      value: selectedItem?.createdBy?._id,
                  }
                : null
        );

        setDescription(selectedItem?.description || "");

        setStatus(
            statusOptions.find(
                (option) => option?.value === selectedItem?.status
            ) || null
        );
    }, [selectedItem]);

    // listen for real-time events and update ui
    useEffect(() => {
        if (!socket) return;

        socket.on("blogsUpdated", refreshData);
        socket.on("blogcategoriesUpdated", refreshData);
        socket.on("usersUpdated", refreshData);

        return () => {
            socket.off("blogsUpdated", refreshData);
            socket.off("blogcategoriesUpdated", refreshData);
            socket.off("usersUpdated", refreshData);
        };
    }, [socket]);

    return (
        <div>
            <div>
                <h1>Blog list</h1>
                <h2>Total blogs: {filteredItems?.length}</h2>
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
                        placeholder="Search blogs..."
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
                    filename="blogs.csv"
                    selectedColumns={[
                        "_id",
                        "title",
                        "slug",
                        "category_title",
                        "thumbnail",
                        "coverImage",
                        "images",
                        "createdBy_fullName",
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

                            <th>Thumbnail</th>

                            <th>Id</th>

                            <th>Title</th>

                            <th>Slug</th>

                            <th>Category</th>

                            <th>Created by</th>

                            <th>Status</th>

                            <th>Created</th>

                            <th>Updated</th>

                            <th>Actions</th>
                        </tr>
                    </thead>

                    <tbody>
                        {filteredItems?.length === 0 ? (
                            <tr>
                                <td colSpan="12" className="text-center">
                                    No blogs found.
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

                                    <td>{item?.slug}</td>

                                    <td>{item?.category?.title}</td>

                                    <td>{item?.createdBy?.fullName}</td>

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
                title={selectedItem ? "Edit blog" : "Add new blog"}
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
                            <span className="">Category</span>

                            <Select
                                name="category"
                                id="category"
                                options={blogCategories.map((blogCategory) => ({
                                    value: blogCategory?._id,
                                    label: blogCategory?.title,
                                }))}
                                onChange={setCategory}
                                className=""
                                placeholder="Search and select category"
                                value={category}
                                required
                            />
                        </div>

                        <div>
                            <span className="">Created by</span>

                            <Select
                                name="createdBy"
                                id="createdBy"
                                options={users.map((user) => ({
                                    label: user?.email,
                                    value: user?._id,
                                }))}
                                onChange={setCreatedBy}
                                className=""
                                placeholder="Search and select user"
                                value={createdBy}
                                required
                            />
                        </div>

                        <div>
                            <label htmlFor="thumbnail" className="">
                                Thumbnail
                            </label>

                            {thumbnailImage || selectedItem?.thumbnail ? (
                                <Image
                                    src={
                                        thumbnailImage
                                            ? URL.createObjectURL(
                                                  thumbnailImage
                                              )
                                            : selectedItem?.thumbnail
                                    }
                                    className="w-full cursor-pointer"
                                    width={1000}
                                    height={1000}
                                    alt="thumbnail image"
                                    onClick={() =>
                                        thumbnailImageRef.current.click()
                                    }
                                    onDragOver={(e) => e.preventDefault()}
                                    onDrop={handleThumbnailImageDrop}
                                />
                            ) : (
                                <DefaultFile
                                    width="w-full"
                                    height="h-[400px]"
                                    iconSize={100}
                                    onClick={() =>
                                        thumbnailImageRef.current.click()
                                    }
                                    onDragOver={(e) => e.preventDefault()}
                                    onDrop={handleThumbnailImageDrop}
                                />
                            )}

                            <input
                                type="file"
                                name="thumbnail"
                                id="thumbnail"
                                className=""
                                accept="image/*"
                                onChange={handleThumbnailImageChange}
                                ref={thumbnailImageRef}
                            />
                        </div>

                        <div>
                            <label htmlFor="coverImage" className="">
                                Cover image
                            </label>

                            {coverImage || selectedItem?.coverImage ? (
                                <Image
                                    src={
                                        coverImage
                                            ? URL.createObjectURL(coverImage)
                                            : selectedItem?.coverImage
                                    }
                                    className="w-full cursor-pointer"
                                    width={1000}
                                    height={1000}
                                    alt="cover image"
                                    onClick={() =>
                                        coverImageRef.current.click()
                                    }
                                    onDragOver={(e) => e.preventDefault()}
                                    onDrop={handleCoverImageDrop}
                                />
                            ) : (
                                <DefaultFile
                                    width="w-full"
                                    height="h-[400px]"
                                    iconSize={100}
                                    onClick={() =>
                                        coverImageRef.current.click()
                                    }
                                    onDragOver={(e) => e.preventDefault()}
                                    onDrop={handleCoverImageDrop}
                                />
                            )}

                            <input
                                type="file"
                                name="coverImage"
                                id="coverImage"
                                className=""
                                accept="image/*"
                                onChange={handleCoverImageChange}
                                ref={coverImageRef}
                            />
                        </div>

                        <div>
                            <label htmlFor="images" className="">
                                Images
                            </label>

                            {images?.length > 0 && (
                                <div className="grid grid-cols-3 gap-4">
                                    {images?.map((image, index) => (
                                        <div key={index} className="relative">
                                            <Image
                                                src={
                                                    image instanceof File
                                                        ? URL.createObjectURL(
                                                              image
                                                          )
                                                        : image
                                                }
                                                className="w-auto h-auto object-cover cursor-pointer"
                                                width={500}
                                                height={500}
                                                alt="image"
                                            />

                                            <button
                                                className="absolute top-2 right-2 bg-red-500 text-white p-1 rounded-full cursor-pointer "
                                                onClick={(e) => {
                                                    e.preventDefault();
                                                    e.stopPropagation();
                                                    removeImageFromPreview(
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
                                onClick={() => imagesRef.current.click()}
                                onDragOver={(e) => e.preventDefault()}
                                onDrop={handleImagesDrop}
                            />

                            <input
                                type="file"
                                name="images"
                                id="images"
                                className=""
                                accept="image/*"
                                onChange={handleImagesChange}
                                ref={imagesRef}
                                multiple
                            />
                        </div>

                        <div>
                            <span className="">Description</span>

                            <TextEditor
                                onChange={setDescription}
                                content={selectedItem?.description}
                            />
                        </div>

                        <div>
                            <span className="">Status</span>

                            <Select
                                name="status"
                                id="status"
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

            {/* view modal */}
            <Modal
                title="Blog details"
                isOpen={isViewModalOpen}
                onClose={closeViewModal}
                width="max-w-4xl"
            >
                {selectedItem && (
                    <div>
                        <div>
                            <h2>Thumbnail</h2>
                            <Image
                                src={selectedItem?.thumbnail}
                                className="w-auto h-auto"
                                width={500}
                                height={500}
                                alt="thumbnail"
                            />
                        </div>

                        <div>
                            <h2>Cover image</h2>
                            <Image
                                src={selectedItem?.coverImage}
                                className="w-auto h-auto"
                                width={500}
                                height={500}
                                alt="cover image"
                            />
                        </div>

                        <div>
                            <h2>Images</h2>
                            <div className="grid grid-cols1 md:grid-cols-2 gap-4">
                                {selectedItem?.images?.map((image, index) => (
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
                            <h2>Id</h2>
                            <p>{selectedItem?._id}</p>
                        </div>

                        <div>
                            <h2>Title</h2>
                            <p>{selectedItem?.title}</p>
                        </div>

                        <div>
                            <h2>Slug</h2>
                            <p>{selectedItem?.slug}</p>
                        </div>

                        <div>
                            <h2>Description</h2>
                            <div
                                dangerouslySetInnerHTML={{
                                    __html: selectedItem?.description,
                                }}
                            ></div>
                        </div>

                        <div>
                            <h2>Category</h2>
                            <p>{selectedItem?.category?.title}</p>
                        </div>

                        <div>
                            <h2>Created by</h2>
                            <p>{selectedItem?.createdBy?.fullName}</p>
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

export default AdminBlogList;
