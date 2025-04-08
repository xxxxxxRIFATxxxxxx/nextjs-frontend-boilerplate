"use client";
import { useEffect, useState } from "react";
import Link from "next/link";
import { toast } from "react-toastify";
import { useSocket } from "@/context/SocketProvider";
import formatDateTime from "@/helpers/formatDateTime";
import fetchDataForClient from "@/helpers/fetchDataForClient";

const UserFileDetailsContent = ({ initialFile, id }) => {
    const socket = useSocket();

    const [file, setFile] = useState(initialFile);

    // fetch updated data when the server sends a real-time update
    const refreshData = async () => {
        // file
        const updatedFileResponse = await fetchDataForClient(
            `${process.env.NEXT_PUBLIC_API_URL}/api/files/active/${id}`
        );
        const updatedFile = updatedFileResponse?.data || null;
        const updatedFileError = updatedFileResponse?.error || null;

        if (updatedFileError) {
            toast.error(updatedFileError);
        } else {
            setFile(updatedFile);
        }
    };

    // listen for real-time events and update ui
    useEffect(() => {
        if (!socket) return;

        socket.on("filesUpdated", refreshData);

        return () => {
            socket.off("filesUpdated", refreshData);
        };
    }, [socket]);

    return (
        <div>
            <div>
                <Link href="/files">Back</Link>
            </div>

            <div>
                <h2>Title</h2>
                <p>{file?.title}</p>
            </div>

            <div>
                <h2>Files</h2>
                <div className="grid grid-cols-1">
                    {file?.files?.map((file, index) => (
                        <Link
                            key={index}
                            href={file}
                            className="hover:underline"
                            target="_blank"
                        >
                            {file}
                        </Link>
                    ))}
                </div>
            </div>

            <div>
                <h2>Status</h2>
                <p>{file?.status}</p>
            </div>

            <div>
                <h2>Created</h2>
                <p>{formatDateTime(file?.createdAt)}</p>
            </div>

            <div>
                <h2>Updated</h2>
                <p>{formatDateTime(file?.updatedAt)}</p>
            </div>
        </div>
    );
};

export default UserFileDetailsContent;
