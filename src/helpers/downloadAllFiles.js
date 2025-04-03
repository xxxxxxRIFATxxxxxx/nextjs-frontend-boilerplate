import Cookies from "js-cookie";

const downloadAllFiles = async () => {
    const token = Cookies.get(`${process.env.NEXT_PUBLIC_APP_NAME}_token`);

    if (!token) {
        throw new Error("No authentication token found.");
    }

    try {
        const url = `${process.env.NEXT_PUBLIC_API_URL}/api/uploads/download-all-files/${token}`;
        const a = document.createElement("a");
        a.href = url;
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
    } catch (error) {
        return { error: error?.message || "Failed to download all files." };
    }
};

export default downloadAllFiles;
