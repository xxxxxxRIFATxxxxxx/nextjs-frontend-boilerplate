"use client";
import { useEffect, useState } from "react";
import Link from "next/link";
import { io } from "socket.io-client";
import { toast } from "react-toastify";
import formatDateTime from "@/helpers/formatDateTime";
import fetchDataForClient from "@/helpers/fetchDataForClient";

const socket = io(process.env.NEXT_PUBLIC_API_URL);

const AdminNotificationDetailsContent = ({ initialNotification, id }) => {
    const [notification, setNotification] = useState(initialNotification);

    // fetch updated data when the server sends a real-time update
    const refreshData = async () => {
        const updatedNotificationResponse = await fetchDataForClient(
            `${process.env.NEXT_PUBLIC_API_URL}/api/notifications/${id}`
        );

        const updatedNotification = updatedNotificationResponse?.data || null;
        const updatedNotificationError =
            updatedNotificationResponse?.error || null;

        if (updatedNotificationError) {
            toast.error(updatedNotificationError);
        } else {
            setNotification(updatedNotification);
        }
    };

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
                <Link href="/admin/notifications">Back</Link>
            </div>

            <div>
                <h2>Id</h2>
                <p>{notification?._id}</p>
            </div>

            <div>
                <h2>Message</h2>
                <p>{notification?.message}</p>
            </div>

            <div>
                <h2>Seen by</h2>
                <div className="grid grid-cols-1">
                    {notification?.seenBy?.map((user, index) => (
                        <p key={index}>{user?.email}</p>
                    ))}
                </div>
            </div>

            <div>
                <h2>Specific users</h2>
                <div className="grid grid-cols-1">
                    {notification?.specificUsers?.map((user, index) => (
                        <p key={index}>{user?.email}</p>
                    ))}
                </div>
            </div>

            <div>
                <h2>Recipient roles</h2>
                <div className="grid grid-cols-1">
                    {notification?.recipientRoles?.map((role, index) => (
                        <p key={index}>{role}</p>
                    ))}
                </div>
            </div>

            <div>
                <h2>Super admin target url</h2>
                <Link
                    href={notification?.targetUrls?.super_admin}
                    className="hover:underline"
                >
                    {notification?.targetUrls?.super_admin}
                </Link>
            </div>

            <div>
                <h2>Admin target url</h2>
                <Link
                    href={notification?.targetUrls?.admin}
                    className="hover:underline"
                >
                    {notification?.targetUrls?.admin}
                </Link>
            </div>

            <div>
                <h2>Moderator target url</h2>
                <Link
                    href={notification?.targetUrls?.moderator}
                    className="hover:underline"
                >
                    {notification?.targetUrls?.moderator}
                </Link>
            </div>

            <div>
                <h2>User target url</h2>
                <Link
                    href={notification?.targetUrls?.user}
                    className="hover:underline"
                >
                    {notification?.targetUrls?.user}
                </Link>
            </div>

            <div>
                <h2>Status</h2>
                <p>{notification?.status}</p>
            </div>

            <div>
                <h2>Created</h2>
                <p>{formatDateTime(notification?.createdAt)}</p>
            </div>

            <div>
                <h2>Updated</h2>
                <p>{formatDateTime(notification?.updatedAt)}</p>
            </div>
        </div>
    );
};

export default AdminNotificationDetailsContent;
