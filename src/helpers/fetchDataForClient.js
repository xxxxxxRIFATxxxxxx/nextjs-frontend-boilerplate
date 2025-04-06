import Cookies from "js-cookie";

const fetchDataForClient = async (apiURL) => {
    const token =
        Cookies.get(`${process.env.NEXT_PUBLIC_APP_NAME}_token`) || null;

    const headers = {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
    };

    try {
        const response = await fetch(apiURL, {
            method: "GET",
            headers,
            cache: "no-store", //
            // always fetch fresh data
        });

        const data = await response.json();

        if (!response.ok) {
            throw new Error(data?.error || "Something went wrong.");
        }

        return data;
    } catch (error) {
        return { error: error?.message || "Failed to fetch data" };
    }
};

export default fetchDataForClient;
