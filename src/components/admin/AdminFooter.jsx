"use client";
import { useEffect, useState } from "react";

const AdminFooter = () => {
    const [currentYear, setCurrentYear] = useState(new Date().getFullYear());

    useEffect(() => {
        setCurrentYear(new Date().getFullYear());
    }, []);

    return (
        <footer className="bg-gray-100 p-4 text-center">
            © {currentYear} Next JS Frontend Boilerplate. All Rights Reserved.
        </footer>
    );
};

export default AdminFooter;
