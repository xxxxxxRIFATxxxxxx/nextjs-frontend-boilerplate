"use client";
import { useState } from "react";
import Image from "next/image";
import { Edit, Trash2 } from "lucide-react";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import useCrud from "@/hooks/useCrud";
import formatDateTime from "@/helpers/formatDateTime";
import uploadSingleFile from "@/helpers/uploadSingleFile";
import Modal from "@/components/common/Modal";
import TextEditor from "@/components/common/TextEditor";
import Layout from "@/components/common/Layout";
import DownloadCSVButton from "@/components/common/DownloadCSVButton";
import Spinner from "@/components/common/Spinner";

const BlogList = ({ blogs, blogCategories, users }) => {
    const [search, setSearch] = useState("");
    const [filteredItems, setFilteredItems] = useState(blogs);
    const { createItem, updateItem, deleteItem, deleteMultipleItems, loading } =
        useCrud("blogs");

    const [isModalOpen, setIsModalOpen] = useState(false);
    const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
    const [isViewModalOpen, setIsViewModalOpen] = useState(false);
    const [selectedItem, setSelectedItem] = useState(null);
    const [selectedItems, setSelectedItems] = useState([]);
    const [selectAll, setSelectAll] = useState(false);
    const [description, setDescription] = useState(
        selectedItem?.description || ""
    );

    // search items
    const handleSearch = (e) => {
        const value = e.target.value.toLowerCase();
        setSearch(value);
        setFilteredItems(
            blogs.filter((item) => item.title.toLowerCase().includes(value))
        );
    };

    // open modal for add/edit
    const openModal = (item = null) => {
        setSelectedItem(item);
        setIsModalOpen(true);
    };

    // open delete confirmation modal
    const openDeleteModal = (item) => {
        setSelectedItem(item);
        setIsDeleteModalOpen(true);
    };

    // handle item creation or update
    const handleSave = async (e) => {
        e.preventDefault();
        const title = e.target.title.value.trim();
        const category = e.target.category.value.trim();
        const thumbnail = e.target.thumbnail.files[0];
        const coverImage = e.target.coverImage.files[0];
        const createdBy = e.target.createdBy.value.trim();
        const status = e.target.status.value.trim();

        let thumbnailUrl = selectedItem?.thumbnail;

        if (thumbnail) {
            const responseFile = await uploadSingleFile(thumbnail);

            if (responseFile?.error) {
                return toast.error(responseFile.error);
            } else {
                thumbnailUrl = responseFile.data.fileUrl;
            }
        }

        let coverImageUrl = selectedItem?.coverImage;

        if (coverImage) {
            const responseFile = await uploadSingleFile(coverImage);

            if (responseFile?.error) {
                return toast.error(responseFile.error);
            } else {
                coverImageUrl = responseFile.data.fileUrl;
            }
        }

        if (selectedItem) {
            const response = await updateItem(selectedItem._id, {
                title,
                description,
                category,
                thumbnail: thumbnailUrl,
                coverImage: coverImageUrl,
                createdBy,
                status,
            });

            if (response?.data) {
                const updatedItem = response?.data;

                setFilteredItems((prev) =>
                    prev.map((item) =>
                        item._id === selectedItem._id
                            ? {
                                  ...updatedItem,
                                  category: blogCategories.find(
                                      (blogCat) => blogCat._id === category
                                  ),
                                  createdBy: users.find(
                                      (user) => user._id === createdBy
                                  ),
                              }
                            : item
                    )
                );
                toast.success(response?.message);
                setDescription("");
                setIsModalOpen(false);
            } else {
                toast.error(response);
            }
        } else {
            const response = await createItem({
                title,
                description,
                category,
                thumbnail: thumbnailUrl,
                coverImage: coverImageUrl,
                createdBy,
                status,
            });

            if (response?.data) {
                const newItem = response?.data;

                setFilteredItems((prev) => [
                    ...prev,
                    {
                        ...newItem,
                        category: blogCategories.find(
                            (blogCat) => blogCat._id === category
                        ),
                        createdBy: users.find((user) => user._id === createdBy),
                    },
                ]);

                toast.success(response?.message);
                setDescription("");
                setIsModalOpen(false);
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

    // open view modal
    const openViewModal = (item) => {
        setSelectedItem(item);
        setIsViewModalOpen(true);
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

    return (
        <div>
            <div>
                <h1>Blog List</h1>
                <h2>Total Blogs: {filteredItems.length}</h2>
            </div>

            <div>
                {/* search Bar */}
                <div>
                    <input
                        type="search"
                        name="search"
                        id="search"
                        autoComplete="on"
                        className=""
                        placeholder="Search blogs..."
                        value={search}
                        onChange={handleSearch}
                        required
                    />
                </div>

                <div>
                    {selectedItems.length > 0 && (
                        <button type="button" onClick={handleBulkDelete}>
                            Delete Selected
                        </button>
                    )}
                </div>

                {/* add item button */}
                <div>
                    <button type="button" onClick={() => openModal()}>
                        {loading ? <Spinner /> : <span>Add New</span>}
                    </button>

                    {/* download csv button */}
                    <DownloadCSVButton
                        data={blogs}
                        filename="blogs.csv"
                        selectedColumns={[
                            "_id",
                            "title",
                            "slug",
                            "category_name",
                            "thumbnail",
                            "coverImage",
                            "createdBy_fullName",
                            "createdAt",
                            "updatedAt",
                        ]}
                    />
                </div>
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

                            <th>Title</th>

                            <th>Slug</th>

                            <th>Category</th>

                            <th>Created By</th>

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
                                    No blogs found
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
                                            alt=""
                                            height={100}
                                            width={100}
                                            style={{
                                                objectFit: "cover",
                                                width: "100px",
                                                height: "100px",
                                            }}
                                            priority
                                        />
                                    </td>

                                    <td>
                                        <span
                                            className="hover:underline cursor-pointer"
                                            onClick={() => openViewModal(item)}
                                        >
                                            {item?.title}
                                        </span>
                                    </td>

                                    <td>{item?.slug}</td>

                                    <td>{item?.category?.name}</td>

                                    <td>{item?.createdBy?.fullName}</td>

                                    <td>{item?.status}</td>

                                    <td>{formatDateTime(item?.createdAt)}</td>

                                    <td>{formatDateTime(item?.updatedAt)}</td>

                                    <td className="p-[18px] relative">
                                        <button onClick={() => openModal(item)}>
                                            <Edit className="w-4 h-4" />
                                        </button>

                                        <button
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

            {/* add / edit modal */}
            <Modal
                title={selectedItem ? "Edit Blog" : "Add New Blog"}
                isOpen={isModalOpen}
                onClose={() => setIsModalOpen(false)}
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
                            <label htmlFor="category" className="">
                                Category
                            </label>

                            <select
                                name="category"
                                id="category"
                                className=""
                                defaultValue={selectedItem?.category._id || ""}
                                required
                            >
                                <option value="" disabled>
                                    Select a category
                                </option>

                                {blogCategories?.map((blogCategory) => (
                                    <option
                                        key={blogCategory._id}
                                        value={blogCategory._id}
                                    >
                                        {blogCategory.name}
                                    </option>
                                ))}
                            </select>
                        </div>

                        <div>
                            <label htmlFor="createdBy" className="">
                                Created By
                            </label>

                            <select
                                name="createdBy"
                                id="createdBy"
                                className=""
                                defaultValue={
                                    selectedItem?.createdBy?._id || ""
                                }
                                required
                            >
                                <option value="" disabled>
                                    Select Created By
                                </option>

                                {users?.map((user) => (
                                    <option key={user._id} value={user._id}>
                                        {user.fullName}
                                    </option>
                                ))}
                            </select>
                        </div>

                        <div>
                            <label htmlFor="thumbnail" className="">
                                Thumbnail
                            </label>

                            <input
                                type="file"
                                name="thumbnail"
                                id="thumbnail"
                                className=""
                                accept="image/*"
                            />
                        </div>

                        <div>
                            <label htmlFor="coverImage" className="">
                                Cover Image
                            </label>

                            <input
                                type="file"
                                name="coverImage"
                                id="coverImage"
                                className=""
                                accept="image/*"
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
                            <span className="">Description</span>

                            <TextEditor
                                onChange={setDescription}
                                content={selectedItem?.description}
                            />
                        </div>

                        <div>
                            <button type="submit">
                                {loading
                                    ? "Saving..."
                                    : selectedItem
                                    ? "Update"
                                    : "Publish"}
                            </button>
                        </div>
                    </form>
                </div>
            </Modal>

            {/* delete modal */}
            <Modal
                title="Permanently Delete"
                isOpen={isDeleteModalOpen}
                onClose={() => setIsDeleteModalOpen(false)}
                width="max-w-md"
            >
                <div>
                    <p>
                        Are you sure you want to delete <br />
                        {selectedItem?.title} ?
                    </p>

                    <button
                        type="button"
                        onClick={() => setIsDeleteModalOpen(false)}
                    >
                        Cancel
                    </button>

                    <button type="button" onClick={handleDelete}>
                        {loading ? <Spinner /> : <span>Delete</span>}
                    </button>
                </div>
            </Modal>

            {/* view modal */}
            <Modal
                title="Blog Details"
                isOpen={isViewModalOpen}
                onClose={() => setIsViewModalOpen(false)}
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
                                alt="Item Image"
                            />
                        </div>

                        <div>
                            <h2>Cover Image</h2>

                            <Image
                                src={selectedItem?.coverImage}
                                className="w-auto h-auto"
                                width={500}
                                height={500}
                                alt="Item Image"
                            />
                        </div>

                        <div>
                            <h2>Title</h2>
                            <p>{selectedItem?.title}</p>
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
                            <p>{selectedItem?.category?.name}</p>
                        </div>

                        <div>
                            <h2>Created By</h2>
                            <p>{selectedItem?.createdBy?.fullName}</p>
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

export default BlogList;
