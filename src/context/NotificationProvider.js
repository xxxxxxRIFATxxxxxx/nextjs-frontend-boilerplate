"use client";
import { createContext, useContext, useState, useEffect } from "react";
import io from "socket.io-client";
import formatDateTime from "@/helpers/formatDateTime";

const NotificationContext = createContext(null);

export const NotificationProvider = ({ children }) => {
    const [notifications, setNotifications] = useState([]);
    const [socket, setSocket] = useState(null);

    useEffect(() => {
        const newSocket = io(process.env.NEXT_PUBLIC_API_URL);
        setSocket(newSocket);

        // listen for updates on all collections
        const collections = ["users", "blogs", "blogcategories"];
        collections.forEach((collectionName) => {
            newSocket.on(`${collectionName}Updated`, (change) => {
                let actionMessage = "";

                // determine the type of database operation
                switch (change.operationType) {
                    case "insert":
                        actionMessage = `A new ${collectionName.slice(
                            0,
                            -1
                        )} was added!`;
                        break;
                    case "update":
                        actionMessage = `A ${collectionName.slice(
                            0,
                            -1
                        )} was updated!`;
                        break;
                    case "delete":
                        actionMessage = `A ${collectionName.slice(
                            0,
                            -1
                        )} was deleted!`;
                        break;
                    default:
                        return;
                }

                // get current timestamp
                const timestamp = new Date().toISOString();
                const formattedTime = formatDateTime(timestamp);

                // add the notification
                setNotifications((prev) => [
                    {
                        id: `${
                            change.documentKey?._id
                        }-${Date.now()}-${Math.random()
                            .toString(36)
                            .substr(2, 5)}`,
                        message: actionMessage,
                        time: formattedTime,
                    },
                    ...prev,
                ]);
            });
        });

        return () => newSocket.disconnect();
    }, []);

    return (
        <NotificationContext.Provider
            value={{ notifications, setNotifications }}
        >
            {children}
        </NotificationContext.Provider>
    );
};

export const useNotifications = () => useContext(NotificationContext);
