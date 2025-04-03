const uploadSingleFile = async (selectedFile) => {
    try {
        const formData = new FormData();
        formData.append("file", selectedFile);

        const response = await fetch(
            `${process.env.NEXT_PUBLIC_FILE_STORAGE_SERVER_API_URL}/api/uploads/single`,
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
        return { error: error?.message || "Failed to upload file." };
    }
};

export default uploadSingleFile;
