"use client";
import { useRef, useState } from "react";
import Image from "next/image";
import { toast } from "react-toastify";
import Layout from "@/components/common/Layout";
import Modal from "@/components/common/Modal";
import PrivateRoute from "@/components/common/PrivateRoute";
import TextEditor from "@/components/common/TextEditor";
import Spinner from "@/components/common/Spinner";
import DefaultUserIcon from "@/components/common/DefaultUserIcon";
import { useAuth } from "@/context/AuthProvider";
import formatDate from "@/helpers/formatDate";
import uploadSingleFile from "@/helpers/uploadSingleFile";

const Profile = () => {
    const { user, updateProfile } = useAuth();
    const [loading, setLoading] = useState(false);
    const [userImage, setUserImage] = useState(null);
    const userImageRef = useRef(null);
    const [isEditModalOpen, setIsEditModalOpen] = useState(false);
    const [bio, setBio] = useState(user?.bio || null);

    // handle profile update
    const handleSave = async (e) => {
        e.preventDefault();

        setLoading(true);

        const fullName = e.target.fullName.value.trim();
        const email = e.target.email.value.trim();
        const phone = e.target.phone.value.trim();
        const username = e.target.username.value.trim();
        const currentPassword = e.target.currentPassword.value.trim();
        const newPassword = e.target.newPassword.value.trim();
        const confirmNewPassword = e.target.confirmNewPassword.value.trim();
        const image = e.target.image.files[0];
        const dateOfBirth = e.target.dateOfBirth.value
            ? new Date(e.target.dateOfBirth.value)
            : null;
        const street = e.target.street.value.trim() || null;
        const city = e.target.city.value.trim() || null;
        const state = e.target.state.value.trim() || null;
        const zipCode = e.target.zipCode.value.trim() || null;
        const country = e.target.country.value.trim() || null;

        if (newPassword && newPassword !== confirmNewPassword) {
            setLoading(false);
            return toast.error(
                "New password and confirm new password do not match."
            );
        }

        let imageUrl = user?.image;

        if (image) {
            const responseFile = await uploadSingleFile(image);

            if (responseFile?.error) {
                setLoading(false);
                return toast.error(responseFile.error);
            } else {
                imageUrl = responseFile.data.fileUrl;
            }
        }

        const profileData = {
            fullName,
            email,
            phone,
            username,
            bio,
            dateOfBirth,
            address: { street, city, state, zipCode, country },
            image: imageUrl,
        };

        if (newPassword && currentPassword) {
            profileData.currentPassword = currentPassword;
            profileData.newPassword = newPassword;
        }

        const response = await updateProfile(profileData);

        setLoading(false);

        if (response?.data) {
            toast.success(response?.message);
            closeEditModal();
        } else {
            toast.error(response);
        }
    };

    // open modal for edit
    const openEditModal = (item = null) => {
        setIsEditModalOpen(true);
    };

    // close modal for edit
    const closeEditModal = () => {
        removeExixtingItems();
        setIsEditModalOpen(false);
    };

    // for remove exixting items
    const removeExixtingItems = () => {
        setUserImage(null);
    };

    // for preview user image
    const handleUserImageChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            setUserImage(file);
        }
    };

    return (
        <PrivateRoute
            allowedRoles={["super_admin", "admin", "moderator", "user"]}
        >
            <Layout>
                <section>
                    {/* user information */}
                    <div>
                        <div>
                            <h2>Full Name</h2>
                            <p>{user?.fullName}</p>
                        </div>

                        <div>
                            <h2>Email:</h2>
                            <p>{user?.email}</p>
                        </div>

                        <div>
                            <h2>Phone:</h2>
                            <p>{user?.phone}</p>
                        </div>

                        <div>
                            <h2>Username:</h2>
                            <p>{user?.username}</p>
                        </div>

                        <div>
                            <h2>Image:</h2>

                            {user?.image ? (
                                <Image
                                    src={user?.image}
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
                            <h2>Date of birth:</h2>
                            {user?.dateOfBirth && (
                                <p>{formatDate(user?.dateOfBirth)}</p>
                            )}
                        </div>

                        <div>
                            <h2>Address:</h2>
                            <p>Street: {user?.address?.street}</p>
                            <p>City: {user?.address?.city}</p>
                            <p>State: {user?.address?.state}</p>
                            <p>Zip code: {user?.address?.zipCode}</p>
                            <p>Country: {user?.address?.country}</p>
                        </div>

                        <div>
                            <h2>Bio:</h2>
                            <div
                                dangerouslySetInnerHTML={{
                                    __html: user?.bio,
                                }}
                            ></div>
                        </div>
                    </div>

                    {/* edit button */}
                    <div>
                        <button type="button" onClick={() => openEditModal()}>
                            Update Profile
                        </button>
                    </div>

                    {/* edit modal */}
                    <Modal
                        title="Edit Profile"
                        isOpen={isEditModalOpen}
                        onClose={closeEditModal}
                        width="max-w-4xl"
                    >
                        <div>
                            <form onSubmit={handleSave}>
                                <div>
                                    <label htmlFor="fullName">Full Name</label>

                                    <input
                                        type="text"
                                        name="fullName"
                                        id="fullName"
                                        autoComplete="name"
                                        className=""
                                        placeholder="Enter full name"
                                        defaultValue={user?.fullName || ""}
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
                                        defaultValue={user?.email || ""}
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
                                        defaultValue={user?.phone || ""}
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
                                        defaultValue={user?.username || ""}
                                        required
                                    />
                                </div>

                                <div>
                                    <label htmlFor="currentPassword">
                                        Current Password
                                    </label>

                                    <input
                                        type="password"
                                        name="currentPassword"
                                        id="currentPassword"
                                        autoComplete="current-password"
                                        className=""
                                        placeholder="••••••••"
                                    />
                                </div>

                                <div>
                                    <label htmlFor="newPassword">
                                        New Password
                                    </label>

                                    <input
                                        type="password"
                                        name="newPassword"
                                        id="newPassword"
                                        autoComplete="new-password"
                                        className=""
                                        placeholder="••••••••"
                                    />
                                </div>

                                <div>
                                    <label htmlFor="confirmNewPassword">
                                        Confirm New Password
                                    </label>

                                    <input
                                        type="password"
                                        name="confirmNewPassword"
                                        id="confirmNewPassword"
                                        autoComplete="new-password"
                                        className=""
                                        placeholder="••••••••"
                                    />
                                </div>

                                <div>
                                    <label htmlFor="image">Image</label>

                                    {userImage || user?.image ? (
                                        <Image
                                            src={
                                                userImage
                                                    ? URL.createObjectURL(
                                                          userImage
                                                      )
                                                    : user?.image
                                            }
                                            className="w-[200px] h-[200px] object-cover rounded-full cursor-pointer"
                                            width={200}
                                            height={200}
                                            alt="user image"
                                            onClick={() =>
                                                userImageRef.current.click()
                                            }
                                        />
                                    ) : (
                                        <DefaultUserIcon
                                            width="w-[200px]"
                                            height="h-[200px]"
                                            iconSize={100}
                                            onClick={() =>
                                                userImageRef.current.click()
                                            }
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
                                    <span>Bio</span>

                                    <TextEditor
                                        onChange={setBio}
                                        content={user?.bio}
                                    />
                                </div>

                                <div>
                                    <label htmlFor="dateOfBirth">
                                        Date of Birth
                                    </label>

                                    <input
                                        type="date"
                                        name="dateOfBirth"
                                        id="dateOfBirth"
                                        autoComplete="bday"
                                        className=""
                                        defaultValue={
                                            user?.dateOfBirth
                                                ? new Date(user.dateOfBirth)
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
                                            user?.address?.street || ""
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
                                        defaultValue={user?.address?.city || ""}
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
                                            user?.address?.state || ""
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
                                            user?.address?.zipCode || ""
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
                                            user?.address?.country || ""
                                        }
                                    />
                                </div>

                                <div>
                                    <button type="submit">
                                        {loading ? (
                                            <Spinner />
                                        ) : (
                                            <span>Update</span>
                                        )}
                                    </button>
                                </div>
                            </form>
                        </div>
                    </Modal>
                </section>
            </Layout>
        </PrivateRoute>
    );
};

export default Profile;
