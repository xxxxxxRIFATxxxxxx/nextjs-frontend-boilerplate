"use client";
import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/context/AuthProvider";
import FullPageSpinner from "@/components/common/FullPageSpinner";

const PrivateRoute = ({ children, allowedRoles = [] }) => {
    const { user, loading } = useAuth();
    const router = useRouter();

    useEffect(() => {
        if (!loading) {
            if (!user) {
                router.replace("/login");
            } else if (!allowedRoles.includes(user?.role)) {
                router.replace("/unauthorized");
            }
        }
    }, [user, loading, router, allowedRoles]);

    if (loading) return <FullPageSpinner />;

    return user && allowedRoles.includes(user?.role) ? children : null;
};

export default PrivateRoute;
