"use client";
import { useState } from "react";
import axios from "axios";
import getAuthHeaders from "@/helpers/getAuthHeaders";

const useCrud = (endpoint) => {
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);

    const createItem = async (data) => {
        setLoading(true);
        setError(null);
        try {
            const response = await axios.post(
                `${process.env.NEXT_PUBLIC_API_URL}/api/${endpoint}`,
                data,
                { headers: getAuthHeaders() }
            );
            return response?.data;
        } catch (error) {
            return (
                error?.response?.data?.error ||
                error?.response?.data ||
                error?.message ||
                "An unexpected error occurred. Please try again later."
            );
        } finally {
            setLoading(false);
        }
    };

    const updateItem = async (id, data) => {
        setLoading(true);
        setError(null);
        try {
            const response = await axios.put(
                `${process.env.NEXT_PUBLIC_API_URL}/api/${endpoint}/${id}`,
                data,
                { headers: getAuthHeaders() }
            );
            return response?.data;
        } catch (error) {
            return (
                error?.response?.data?.error ||
                error?.response?.data ||
                error?.message ||
                "An unexpected error occurred. Please try again later."
            );
        } finally {
            setLoading(false);
        }
    };

    const deleteItem = async (id) => {
        setLoading(true);
        setError(null);
        try {
            const response = await axios.delete(
                `${process.env.NEXT_PUBLIC_API_URL}/api/${endpoint}/${id}`,
                { headers: getAuthHeaders() }
            );
            return response?.data;
        } catch (error) {
            return (
                error?.response?.data?.error ||
                error?.response?.data ||
                error?.message ||
                "An unexpected error occurred. Please try again later."
            );
        } finally {
            setLoading(false);
        }
    };

    const deleteMultipleItems = async (ids) => {
        setLoading(true);
        setError(null);
        try {
            const response = await axios.delete(
                `${process.env.NEXT_PUBLIC_API_URL}/api/${endpoint}/bulk/delete`,
                {
                    headers: getAuthHeaders(),
                    data: { ids },
                }
            );
            return response?.data;
        } catch (error) {
            return (
                error?.response?.data?.error ||
                error?.response?.data ||
                error?.message ||
                "An unexpected error occurred. Please try again later."
            );
        } finally {
            setLoading(false);
        }
    };

    return {
        createItem,
        updateItem,
        deleteItem,
        deleteMultipleItems,
        loading,
        error,
    };
};

export default useCrud;
