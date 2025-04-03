const uploadMultipleFiles = async (selectedFiles) => {
    try {
        const formData = new FormData();
        selectedFiles.forEach((file) => formData.append("files", file));

        const response = await fetch(
            `${process.env.NEXT_PUBLIC_FILE_STORAGE_SERVER_API_URL}/api/uploads/multiple`,
            {
                method: "POST",
                headers: {
                    Authorization: `Bearer ${process.env.NEXT_PUBLIC_FILE_STORAGE_SERVER_PASSWORD}`,
                },
                body: formData,
            }
        );

        const data = await response.json();

        if (!response.ok) {
            throw new Error(
                data?.error || data?.message || "Something went wrong."
            );
        }

        return data;
    } catch (error) {
        return { error: error?.message || "Failed to upload files." };
    }
};

export default uploadMultipleFiles;
