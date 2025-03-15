import Cookies from "js-cookie";

const removeAuthCookies = () => {
    Cookies.remove(`${process.env.NEXT_PUBLIC_APP_NAME}_token`);
    Cookies.remove(`${process.env.NEXT_PUBLIC_APP_NAME}_userId`);
};

export default removeAuthCookies;
