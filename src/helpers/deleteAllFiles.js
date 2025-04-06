import Cookies from "js-cookie";

const deleteAllFiles = async () => {
    const token = Cookies.get(`${process.env.NEXT_PUBLIC_APP_NAME}_token`);

    if (!token) {
        throw new Error("No authentication token found.");
    }

    try {
        const response = await fetch(
            `${process.env.NEXT_PUBLIC_API_URL}/api/uploads/delete-all-files`,
            {
                method: "DELETE",
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${token}`,
                },
            }
        );

        const data = await response.json();

        if (!response.ok) {
            throw new Error(data?.error || "Something went wrong.");
        }

        return data;
    } catch (error) {
        return { error: error?.message || "Failed to delete all files." };
    }
};

export default deleteAllFiles;
