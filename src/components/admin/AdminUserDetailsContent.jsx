"use client";
import { useEffect, useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { toast } from "react-toastify";
import DefaultUserIcon from "@/components/common/DefaultUserIcon";
import { useSocket } from "@/context/SocketProvider";
import formatDate from "@/helpers/formatDate";
import formatDateTime from "@/helpers/formatDateTime";
import fetchDataForClient from "@/helpers/fetchDataForClient";

const AdminUserDetailsContent = ({ initialUser, id }) => {
    const socket = useSocket();

    const [user, setUser] = useState(initialUser);

    // fetch updated data when the server sends a real-time update
    const refreshData = async () => {
        // user
        const updatedUserResponse = await fetchDataForClient(
            `${process.env.NEXT_PUBLIC_API_URL}/api/users/active/${id}`
        );
        const updatedUser = updatedUserResponse?.data || null;
        const updatedUserError = updatedUserResponse?.error || null;

        if (updatedUserError) {
            toast.error(updatedUserError);
        } else {
            setUser(updatedUser);
        }
    };

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
                <Link href="/admin/users">Back</Link>
            </div>

            <div>
                <h2>Image</h2>
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
                <h2>Id</h2>
                <p>{user?._id}</p>
            </div>

            <div>
                <h2>Full name</h2>
                <p>{user?.fullName}</p>
            </div>

            <div>
                <h2>Email</h2>
                <p>{user?.email}</p>
            </div>

            <div>
                <h2>Phone</h2>
                <p>{user?.phone}</p>
            </div>

            <div>
                <h2>Username</h2>
                <p>{user?.username}</p>
            </div>

            <div>
                <h2>Role</h2>
                <p>{user?.role}</p>
            </div>

            <div>
                <h2>Date of birth</h2>
                {user?.dateOfBirth && <p>{formatDate(user?.dateOfBirth)}</p>}
            </div>

            <div>
                <h2>Address</h2>
                <p>Street: {user?.address?.street}</p>
                <p>City: {user?.address?.city}</p>
                <p>State: {user?.address?.state}</p>
                <p>Zip code: {user?.address?.zipCode}</p>
                <p>Country: {user?.address?.country}</p>
            </div>

            <div>
                <h2>Bio</h2>
                <div
                    dangerouslySetInnerHTML={{
                        __html: user?.bio,
                    }}
                ></div>
            </div>

            <div>
                <h2>Last login</h2>
                <p>{formatDateTime(user?.lastLogin)}</p>
            </div>

            <div>
                <h2>Status</h2>
                <p>{user?.status}</p>
            </div>

            <div>
                <h2>Created</h2>
                <p>{formatDateTime(user?.createdAt)}</p>
            </div>

            <div>
                <h2>Updated</h2>
                <p>{formatDateTime(user?.updatedAt)}</p>
            </div>
        </section>
    );
};

export default AdminUserDetailsContent;
