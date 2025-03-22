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

            setNotifications(response.data.data);

            return response.data;
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

    const markAsSeen = async () => {
        try {
            const unseenNotificationIds = notifications
                .filter(
                    (n) => !n.seenBy.some((userObj) => userObj._id === user._id)
                ) // Check populated user objects
                .map((n) => n._id); // Extract their IDs

            if (unseenNotificationIds.length === 0) return; // No unseen notifications

            const response = await axios.put(
                `${process.env.NEXT_PUBLIC_API_URL}/api/notifications/user-specific-notifications/seen`,
                { notificationIds: unseenNotificationIds }, // Send array of IDs
                { headers: getAuthHeaders() }
            );

            // Update state to mark notifications as seen
            setNotifications((prev) =>
                prev.map((n) =>
                    unseenNotificationIds.includes(n._id)
                        ? { ...n, seenBy: [...n.seenBy, { _id: user._id }] } // Add populated user
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
            value={{ notifications, loading, fetchNotifications, markAsSeen }}
        >
            {children}
        </NotificationContext.Provider>
    );
};

export const useNotifications = () => useContext(NotificationContext);
