"use client";
import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/context/AuthProvider";
import FullPageSpinner from "@/components/common/FullPageSpinner";

const PrivateRoute = ({ children }) => {
    const { user, loading } = useAuth();
    const router = useRouter();

    useEffect(() => {
        if (!loading && !user) {
            router.replace("/login");
        }
    }, [user, loading, router]);

    if (loading) return <FullPageSpinner />;
    return user ? children : null;
};

export default PrivateRoute;
