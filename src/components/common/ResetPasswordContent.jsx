"use client";
import React, { Suspense, useState } from "react";
import Input from "./Input";
import PrimaryButton from "./PrimaryButton";
import H4 from "../ui/H4";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { useSearchParams, useRouter } from "next/navigation";
import FullPageSpinner from "./FullPageSpinner";
import { useAuth } from "@/context/AuthProvider";

const ResetPasswordContent = () => {
    const { resetPassword } = useAuth();
    const router = useRouter();
    const searchParams = useSearchParams();
    const token = searchParams.get("token");

    const [newPassword, setNewPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");
    const [loading, setLoading] = useState(false);

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (newPassword !== confirmPassword) {
            toast.error("Passwords do not match");
            return;
        }

        setLoading(true);

        const response = await resetPassword(token, newPassword);

        if (response?.message) {
            toast.success(response.message);
            setTimeout(() => router.push("/login"), 200);
        } else {
            toast.error(response?.message || response);
        }

        setLoading(false);
    };

    return (
        <Suspense fallback={<FullPageSpinner />}>
            <ToastContainer theme="colored" />

            <main>
                <div className="flex justify-center items-center m-4 md:my-40">
                    <div className="bg-white rounded-[10px] border-2 border-color7 p-6 w-full md:w-96 space-y-4">
                        <div className="text-center">
                            <H4>Reset Password</H4>
                        </div>

                        <form onSubmit={handleSubmit} className="space-y-4">
                            <Input
                                type="password"
                                placeholder="New Password"
                                value={newPassword}
                                onChange={(e) => setNewPassword(e.target.value)}
                                required={true}
                            />

                            <Input
                                type="password"
                                placeholder="Confirm Password"
                                value={confirmPassword}
                                onChange={(e) =>
                                    setConfirmPassword(e.target.value)
                                }
                                required={true}
                            />

                            <PrimaryButton
                                customClassName="w-full"
                                type="submit"
                                disabled={loading} // Disable button when loading
                            >
                                {loading ? "Resetting..." : "Reset Password"}
                            </PrimaryButton>
                        </form>
                    </div>
                </div>
            </main>
        </Suspense>
    );
};

export default ResetPasswordContent;
