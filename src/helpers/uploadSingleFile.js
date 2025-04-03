import Cookies from "js-cookie";

const uploadSingleFile = async (selectedFile) => {
    const token = Cookies.get(`${process.env.NEXT_PUBLIC_APP_NAME}_token`);

    const headers = {
        Authorization: `Bearer ${token}`,
    };

    try {
        const formData = new FormData();
        formData.append("file", selectedFile);

        const response = await fetch(
            `${process.env.NEXT_PUBLIC_API_URL}/api/uploads/single`,
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
        return { error: error?.message || "Failed to upload file." };
    }
};

export default uploadSingleFile;
