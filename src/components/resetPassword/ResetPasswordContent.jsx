"use client";
import { Suspense, useState } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import { toast } from "react-toastify";
import { useAuth } from "@/context/AuthProvider";
import Spinner from "@/components/common/Spinner";
import FullPageSpinner from "@/components/common/FullPageSpinner";

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

            // reset form fields
            setNewPassword("");
            setConfirmPassword("");

            router.push("/login");
        } else {
            toast.error(response?.message || response);
        }

        setLoading(false);
    };

    return (
        <Suspense fallback={<FullPageSpinner />}>
            <section className="h-screen">
                <h1>Reset Password</h1>

                <form onSubmit={handleSubmit}>
                    <div>
                        <label htmlFor="newPassword" className="">
                            New Password
                        </label>
                        <input
                            type="password"
                            name="newPassword"
                            id="newPassword"
                            autoComplete="new-password"
                            className=""
                            placeholder="••••••••"
                            value={newPassword}
                            onChange={(e) => setNewPassword(e.target.value)}
                            required
                        />
                    </div>

                    <div>
                        <label htmlFor="confirmPassword" className="">
                            Confirm Password
                        </label>

                        <input
                            type="password"
                            name="confirmPassword"
                            id="confirmPassword"
                            autoComplete="new-password"
                            className=""
                            placeholder="••••••••"
                            value={confirmPassword}
                            onChange={(e) => setConfirmPassword(e.target.value)}
                            required
                        />
                    </div>

                    <button type="submit" className="" disabled={loading}>
                        {loading ? <Spinner /> : <span>Reset Password</span>}
                    </button>
                </form>
            </section>
        </Suspense>
    );
};

export default ResetPasswordContent;
