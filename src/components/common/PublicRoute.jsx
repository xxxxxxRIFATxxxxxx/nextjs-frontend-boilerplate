"use client";
import { useEffect } from "react";
import { useRouter } from "next/navigation";
import FullPageSpinner from "@/components/common/FullPageSpinner";
import { useAuth } from "@/context/AuthProvider";

const PublicRoute = ({ children }) => {
    const { user, loading } = useAuth();
    const router = useRouter();

    useEffect(() => {
        if (!loading && user) {
            router.replace("/");
        }
    }, [user, loading, router]);

    if (loading) return <FullPageSpinner />;

    return !user ? children : null;
};

export default PublicRoute;
