"use client";
import { createContext, useContext, useEffect, useState } from "react";
import { io } from "socket.io-client";
import FullPageSpinner from "@/components/common/FullPageSpinner";

const SocketContext = createContext(null);

export const SocketProvider = ({ children }) => {
    const [socket, setSocket] = useState(null);

    useEffect(() => {
        const socketInstance = io(process.env.NEXT_PUBLIC_API_URL);
        setSocket(socketInstance);

        return () => {
            socketInstance.disconnect();
        };
    }, []);

    if (!socket) return <FullPageSpinner />;

    return (
        <SocketContext.Provider value={socket}>
            {children}
        </SocketContext.Provider>
    );
};

export const useSocket = () => useContext(SocketContext);
