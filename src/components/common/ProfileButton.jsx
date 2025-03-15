import { useState, useEffect, useRef } from "react";
import { User, ChevronDown } from "lucide-react";
import Link from "next/link";
import { useAuth } from "@/context/AuthProvider";
import Image from "next/image";

const ProfileButton = ({ user }) => {
    const [isOpen, setIsOpen] = useState(false);
    const dropdownRef = useRef(null);
    const { logout } = useAuth();

    // Close dropdown if clicked outside
    useEffect(() => {
        const handleClickOutside = (event) => {
            if (
                dropdownRef.current &&
                !dropdownRef.current.contains(event.target)
            ) {
                setIsOpen(false);
            }
        };

        document.addEventListener("mousedown", handleClickOutside);
        return () => {
            document.removeEventListener("mousedown", handleClickOutside);
        };
    }, []);

    return (
        <div ref={dropdownRef} className="relative group inline-block">
            <button
                onClick={() => setIsOpen(!isOpen)}
                className="bg-color4 hover:bg-color5 text-color7 text-center rounded-full py-[10px] px-[20px] flex items-center justify-center space-x-2 transition"
            >
                <div className="bg-color9 flex items-center justify-center rounded-full border border-color9">
                    <Image
                        src={
                            user?.image
                                ? `${process.env.NEXT_PUBLIC_API_URL}${user?.image}`
                                : "/images/default-profile-image.png"
                        }
                        width={36}
                        height={36}
                        alt="Profile Image"
                        style={{
                            objectFit: "cover",
                            width: "36px",
                            height: "36px",
                        }}
                        className="rounded-full"
                    />
                </div>

                <span>
                    <span className="text-color7">{user?.fullName}</span>
                </span>

                <ChevronDown className="w-5 h-5 text-color9" />
            </button>

            {/* Dropdown Menu */}
            {isOpen && (
                <div className="absolute left-0 mt-2 w-44 bg-color5 text-color7 shadow-lg rounded-lg opacity-100 visible transition-all duration-300">
                    <ul className="text-sm">
                        <li>
                            <Link
                                href="/profile/personal-information"
                                className="block px-4 py-3 hover:bg-color4 rounded-lg"
                            >
                                Profile
                            </Link>
                        </li>

                        <li onClick={logout}>
                            <Link
                                href="#"
                                className="block px-4 py-3 hover:bg-color4 rounded-lg"
                            >
                                Logout
                            </Link>
                        </li>
                    </ul>
                </div>
            )}
        </div>
    );
};

export default ProfileButton;
