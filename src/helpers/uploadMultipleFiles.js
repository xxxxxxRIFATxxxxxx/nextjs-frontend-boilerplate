import Cookies from "js-cookie";

const uploadMultipleFiles = async (selectedFiles) => {
    const token = Cookies.get(`${process.env.NEXT_PUBLIC_APP_NAME}_token`);

    const headers = {
        Authorization: `Bearer ${token}`,
    };

    try {
        const formData = new FormData();
        selectedFiles.forEach((file) => formData.append("files", file));

        const response = await fetch(
            `${process.env.NEXT_PUBLIC_API_URL}/api/uploads/multiple`,
            {
                method: "POST",
                headers,
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
