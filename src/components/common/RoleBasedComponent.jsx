"use client";
import { useEffect, useState } from "react";
import Spinner from "@/components/common/Spinner";
import { useAuth } from "@/context/AuthProvider";

const RoleBasedComponent = ({ allowedRoles = [], children }) => {
    const { user, loading } = useAuth();
    const [isAuthorized, setIsAuthorized] = useState(false);

    useEffect(() => {
        if (!loading) {
            if (!user) {
                setIsAuthorized(false);
            } else if (allowedRoles.includes(user?.role)) {
                setIsAuthorized(true);
            } else {
                setIsAuthorized(false);
            }
        }
    }, [user, loading, allowedRoles]);

    if (loading) return <Spinner />;

    return isAuthorized ? children : null;
};

export default RoleBasedComponent;
