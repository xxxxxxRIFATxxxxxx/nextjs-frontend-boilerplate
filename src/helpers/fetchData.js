const fetchData = async (apiURL) => {
    try {
        const response = await fetch(apiURL, {
            method: "GET",
            cache: "no-store", // always fetch fresh data
        });

        return await response.json();
    } catch (error) {
        return (
            error?.response?.data?.error ||
            error?.response?.data ||
            error?.message ||
            error
        );
    }
};

export default fetchData;
