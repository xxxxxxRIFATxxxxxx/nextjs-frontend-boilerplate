import Cookies from "js-cookie";

const setAuthCookies = (token, userId) => {
    Cookies.set(`${process.env.NEXT_PUBLIC_APP_NAME}_token`, token, {
        expires: 1,
    });
    Cookies.set(`${process.env.NEXT_PUBLIC_APP_NAME}_userId`, userId, {
        expires: 1,
    });
};

export default setAuthCookies;
