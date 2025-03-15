"use client";
import { createContext, useState, useEffect, useContext } from "react";
import { useRouter } from "next/navigation";
import axios from "axios";
import { jwtDecode } from "jwt-decode";
import Cookies from "js-cookie";
import getAuthHeaders from "@/helpers/getAuthHeaders";
import setAuthCookies from "@/helpers/setAuthCookies";
import removeAuthCookies from "@/helpers/removeAuthCookies";

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
    const router = useRouter();
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);
    let logoutTimer = null;

    useEffect(() => {
        setLoading(true);

        const token = Cookies.get(`${process.env.NEXT_PUBLIC_APP_NAME}_token`);
        const userId = Cookies.get(
            `${process.env.NEXT_PUBLIC_APP_NAME}_userId`
        );

        if (token && userId) {
            const decoded = decodeToken(token);
            if (decoded) {
                fetchUser(userId);
                scheduleAutoLogout(decoded.exp);
            } else {
                logout();
            }
        } else {
            setLoading(false);
        }

        return () => clearTimeout(logoutTimer);
    }, []);

    const decodeToken = (token) => {
        try {
            return jwtDecode(token);
        } catch {
            return null;
        }
    };

    const scheduleAutoLogout = (exp) => {
        const expiresIn = exp * 1000 - Date.now();
        if (expiresIn > 0) {
            logoutTimer = setTimeout(() => logout(), expiresIn);
        } else {
            logout();
        }
    };

    const fetchUser = async (userId) => {
        setLoading(true);

        try {
            const response = await axios.get(
                `${process.env.NEXT_PUBLIC_API_URL}/api/users/${userId}`,
                { headers: getAuthHeaders() }
            );

            setUser(response.data.data);

            return response.data;
        } catch (error) {
            logout();

            return (
                error?.response?.data?.error ||
                error?.response?.data ||
                error?.message ||
                error
            );
        } finally {
            setLoading(false);
        }
    };

    const login = async (emailOrPhoneOrUsername, password) => {
        try {
            const response = await axios.post(
                `${process.env.NEXT_PUBLIC_API_URL}/api/users/login`,
                { emailOrPhoneOrUsername, password }
            );

            setAuthCookies(response.data.token, response.data.data._id);
            setUser(response.data.data);

            const decoded = decodeToken(response.data.token);
            if (decoded) scheduleAutoLogout(decoded.exp);
            router.push("/");

            return response.data;
        } catch (error) {
            return (
                error?.response?.data?.error ||
                error?.response?.data ||
                error?.message ||
                error
            );
        }
    };

    const signup = async (userInfo) => {
        try {
            const response = await axios.post(
                `${process.env.NEXT_PUBLIC_API_URL}/api/users/signup`,
                userInfo
            );

            setAuthCookies(response.data.token, response.data.data._id);
            setUser(response.data.data);

            const decoded = decodeToken(response.data.token);
            if (decoded) scheduleAutoLogout(decoded.exp);
            router.push("/");

            return response.data;
        } catch (error) {
            return (
                error?.response?.data?.error ||
                error?.response?.data ||
                error?.message ||
                error
            );
        }
    };

    const updateProfile = async (updates) => {
        try {
            const response = await axios.put(
                `${process.env.NEXT_PUBLIC_API_URL}/api/users/update-profile`,
                updates,
                { headers: getAuthHeaders() }
            );

            setUser(response.data.data);

            return response.data;
        } catch (error) {
            return (
                error?.response?.data?.error ||
                error?.response?.data ||
                error?.message ||
                error
            );
        }
    };

    const forgotPassword = async (email) => {
        try {
            const response = await axios.post(
                `${process.env.NEXT_PUBLIC_API_URL}/api/users/forgot-password`,
                { email }
            );

            return response.data;
        } catch (error) {
            return (
                error?.response?.data?.error ||
                error?.response?.data ||
                error?.message ||
                error
            );
        }
    };

    const resetPassword = async (token, newPassword) => {
        try {
            const response = await axios.post(
                `${process.env.NEXT_PUBLIC_API_URL}/api/users/reset-password`,
                { token, newPassword }
            );

            return response.data;
        } catch (error) {
            return (
                error?.response?.data?.error ||
                error?.response?.data ||
                error?.message ||
                error
            );
        }
    };

    const logout = () => {
        removeAuthCookies();
        setUser(null);
        clearTimeout(logoutTimer);
        router.push("/login");
    };

    return (
        <AuthContext.Provider
            value={{
                user,
                loading,
                login,
                signup,
                updateProfile,
                forgotPassword,
                resetPassword,
                logout,
            }}
        >
            {children}
        </AuthContext.Provider>
    );
};

export const useAuth = () => useContext(AuthContext);
