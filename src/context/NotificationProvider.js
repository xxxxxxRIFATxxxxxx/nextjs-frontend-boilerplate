"use client";
import { createContext, useState, useEffect, useContext } from "react";
import axios from "axios";
import { io } from "socket.io-client";
import getAuthHeaders from "@/helpers/getAuthHeaders";
import { useAuth } from "@/context/AuthProvider";

const NotificationContext = createContext(null);
const socket = io(process.env.NEXT_PUBLIC_API_URL);

export const NotificationProvider = ({ children }) => {
    const { user } = useAuth();
    const [notifications, setNotifications] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        if (user) {
            fetchNotifications();

            socket.on("notificationsUpdated", async () => {
                await fetchNotifications();
            });
        }

        return () => {
            socket.off("notificationsUpdated");
        };
    }, [user]);

    const fetchNotifications = async () => {
        if (!user) return;

        try {
            setLoading(true);

            const response = await axios.get(
                `${process.env.NEXT_PUBLIC_API_URL}/api/notifications/user-specific-notifications`,
                { headers: getAuthHeaders() }
            );

            setNotifications(response?.data?.data);

            return response?.data;
        } catch (error) {
            return (
                error?.response?.data?.error ||
                error?.response?.data ||
                error?.message ||
                "An unexpected error occurred. Please try again later."
            );
        } finally {
            setLoading(false);
        }
    };

    const markSingleNotificationAsSeen = async (notificationId) => {
        try {
            if (!notificationId) return;

            const response = await axios.put(
                `${process.env.NEXT_PUBLIC_API_URL}/api/notifications/user-specific-notifications/seen/${notificationId}`,
                {}, // no body needed as id is in the URL
                { headers: getAuthHeaders() }
            );

            // update state to mark the specific notification as seen
            setNotifications((prev) =>
                prev.map((n) =>
                    n?._id === notificationId
                        ? { ...n, seenBy: [...n?.seenBy, { _id: user?._id }] } // add user id to seenBy
                        : n
                )
            );

            return response.message;
        } catch (error) {
            return (
                error?.response?.data?.error ||
                error?.response?.data ||
                error?.message ||
                "An unexpected error occurred. Please try again later."
            );
        }
    };

    const markMultipleNotificationAsSeen = async () => {
        try {
            const unseenNotificationIds = notifications
                .filter(
                    (n) =>
                        !n?.seenBy.some((userObj) => userObj?._id === user?._id)
                ) // check populated user objects
                .map((n) => n?._id); // extract their ids

            if (unseenNotificationIds.length === 0) return; // no unseen notifications

            const response = await axios.put(
                `${process.env.NEXT_PUBLIC_API_URL}/api/notifications/user-specific-notifications/seen`,
                { notificationIds: unseenNotificationIds }, // send array of ids
                { headers: getAuthHeaders() }
            );

            // update state to mark notifications as seen
            setNotifications((prev) =>
                prev.map((n) =>
                    unseenNotificationIds.includes(n?._id)
                        ? { ...n, seenBy: [...n?.seenBy, { _id: user?._id }] } // add populated user
                        : n
                )
            );

            return response.message;
        } catch (error) {
            return (
                error?.response?.data?.error ||
                error?.response?.data ||
                error?.message ||
                "An unexpected error occurred. Please try again later."
            );
        }
    };

    return (
        <NotificationContext.Provider
            value={{
                notifications,
                loading,
                fetchNotifications,
                markSingleNotificationAsSeen,
                markMultipleNotificationAsSeen,
            }}
        >
            {children}
        </NotificationContext.Provider>
    );
};

export const useNotifications = () => useContext(NotificationContext);
