import Cookies from "js-cookie";

const getAuthHeaders = (isFormData = false) => {
    const token = Cookies.get(`${process.env.NEXT_PUBLIC_APP_NAME}_token`);
    const headers = { Authorization: `Bearer ${token}` };

    if (!isFormData) {
        headers["Content-Type"] = "application/json";
    }

    return headers;
};

export default getAuthHeaders;
