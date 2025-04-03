"use client";
import { useState, useEffect, useRef } from "react";
import Link from "next/link";
import { toast } from "react-toastify";
import { Bell } from "lucide-react";
import { useAuth } from "@/context/AuthProvider";
import { useNotifications } from "@/context/NotificationProvider";
import formatDateTime from "@/helpers/formatDateTime";

const NotificationTab = () => {
    const { user } = useAuth();
    const {
        notifications,
        markSingleNotificationAsSeen,
        markMultipleNotificationAsSeen,
    } = useNotifications();
    const [isOpen, setIsOpen] = useState(false);
    const dropdownRef = useRef(null);

    // close dropdown when clicking outside
    useEffect(() => {
        const handleClickOutside = (event) => {
            if (
                dropdownRef.current &&
                !dropdownRef.current.contains(event.target)
            ) {
                setIsOpen(false);
            }
        };

        document.addEventListener("mousedown", handleClickOutside);
        return () =>
            document.removeEventListener("mousedown", handleClickOutside);
    }, []);

    // count unseen notifications
    const unseenCount = notifications.filter(
        (notif) => !notif.seenBy.some((userObj) => userObj?._id === user?._id)
    ).length;

    // mark a single notification as seen
    const handleNotificationClick = async (notifId) => {
        const response = await markSingleNotificationAsSeen(notifId);
        if (!response?.message) {
            toast.error(response);
        }
    };

    // mark all notifications as seen
    const handleMarkAllAsSeen = async () => {
        const response = await markMultipleNotificationAsSeen();
        if (!response?.message) {
            toast.error(response);
        }
    };

    return (
        <div className="relative" ref={dropdownRef}>
            {/* notification bell icon */}
            <button
                onClick={() => setIsOpen(!isOpen)}
                className={`relative p-2 rounded-full cursor-pointer ${
                    isOpen ? "bg-gray-200" : "bg-gray-100 hover:bg-gray-200"
                }`}
            >
                <Bell className="w-6 h-6 text-gray-700" />

                {unseenCount > 0 && (
                    <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full px-2">
                        {unseenCount}
                    </span>
                )}
            </button>

            {/* notification dropdown */}
            {isOpen && (
                <div className="absolute right-0 mt-2 w-64 bg-white shadow-lg rounded-lg p-3 z-50">
                    <div className="mb-2 flex justify-between items-center">
                        <span className="font-semibold">Notifications</span>
                        {unseenCount > 0 && (
                            <button
                                onClick={handleMarkAllAsSeen}
                                className="text-xs text-blue-500 hover:underline cursor-pointer"
                            >
                                Mark all as read
                            </button>
                        )}
                    </div>

                    {/* notification list */}
                    <ul className="space-y-2 max-h-60 overflow-y-auto scrollbar-thin scrollbar-thumb-gray-400 scrollbar-track-gray-100">
                        {notifications.length > 0 ? (
                            notifications.map((notif) => (
                                <li
                                    key={notif?._id}
                                    className="relative p-2 bg-gray-100 hover:bg-gray-200 rounded-lg text-sm flex flex-col"
                                    onClick={() =>
                                        handleNotificationClick(notif?._id)
                                    }
                                >
                                    {!notif.seenBy.some(
                                        (userObj) => userObj?._id === user?._id
                                    ) && (
                                        <span className="absolute top-2 right-2 w-2 h-2 bg-red-500 rounded-full"></span>
                                    )}

                                    <Link
                                        href={notif?.targetUrl}
                                        className="font-medium"
                                    >
                                        {notif?.message}
                                    </Link>

                                    <Link
                                        href={notif?.targetUrl}
                                        className="text-xs text-gray-500"
                                    >
                                        {formatDateTime(notif?.createdAt)}
                                    </Link>
                                </li>
                            ))
                        ) : (
                            <p className="text-gray-500 text-sm">
                                No notifications.
                            </p>
                        )}
                    </ul>
                </div>
            )}
        </div>
    );
};

export default NotificationTab;
