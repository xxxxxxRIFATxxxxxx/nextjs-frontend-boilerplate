import Cookies from "js-cookie";

const getAuthHeaders = () => {
    const token = Cookies.get(`${process.env.NEXT_PUBLIC_APP_NAME}_token`);
    return {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
    };
};

export default getAuthHeaders;
