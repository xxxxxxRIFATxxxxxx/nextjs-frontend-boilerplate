"use client";
import { useNotifications } from "@/context/NotificationProvider";
import { useState, useEffect, useRef } from "react";
import { Bell } from "lucide-react";

const NotificationTab = () => {
    const { notifications, setNotifications } = useNotifications();
    const [isOpen, setIsOpen] = useState(false);
    const dropdownRef = useRef(null);

    // mark all notifications as seen when dropdown closes
    useEffect(() => {
        if (!isOpen) {
            setNotifications((prev) =>
                prev.map((notif) => ({ ...notif, seen: true }))
            );
        }
    }, [isOpen, setNotifications]);

    const handleClearNotifications = () => {
        setNotifications([]);
    };

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

    // count unseen notifications (does not change until dropdown is closed)
    const unseenCount = notifications.filter((notif) => !notif.seen).length;

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
                    <div className="flex justify-between items-center mb-2">
                        <span className="font-semibold">Notifications</span>
                        <button
                            onClick={handleClearNotifications}
                            className="text-sm text-red-500 hover:underline"
                        >
                            Clear All
                        </button>
                    </div>

                    {/* notification list with scroll */}
                    <ul className="space-y-2 max-h-60 overflow-y-auto scrollbar-thin scrollbar-thumb-gray-400 scrollbar-track-gray-100">
                        {notifications.length > 0 ? (
                            notifications.map((notif) => (
                                <li
                                    key={notif.id}
                                    className="relative p-2 bg-gray-100 rounded-lg text-sm flex flex-col"
                                >
                                    {/* red dot for unseen notifications */}
                                    {!notif.seen && (
                                        <span className="absolute top-2 right-2 w-2 h-2 bg-red-500 rounded-full"></span>
                                    )}
                                    <span className="font-medium">
                                        {notif.message}
                                    </span>
                                    <span className="text-xs text-gray-500">
                                        {notif.time}
                                    </span>
                                </li>
                            ))
                        ) : (
                            <p className="text-gray-500 text-sm">
                                No notifications
                            </p>
                        )}
                    </ul>
                </div>
            )}
        </div>
    );
};

export default NotificationTab;
