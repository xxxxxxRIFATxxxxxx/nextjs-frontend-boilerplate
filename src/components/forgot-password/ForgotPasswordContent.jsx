"use client";
import { useState } from "react";
import { toast } from "react-toastify";
import { useAuth } from "@/context/AuthProvider";
import Spinner from "@/components/common/Spinner";

const ForgotPasswordContent = () => {
    const [email, setEmail] = useState("");
    const [loading, setLoading] = useState(false);
    const { forgotPassword } = useAuth();

    const handleSubmit = async (e) => {
        e.preventDefault();

        setLoading(true);

        const response = await forgotPassword(email);

        if (response?.message) {
            toast.success(response.message);

            // reset form fields
            setEmail("");
        } else {
            toast.error(response?.message || response);
        }

        setLoading(false);
    };

    return (
        <section className="h-screen">
            <h1>Forgot Password</h1>

            <form onSubmit={handleSubmit}>
                <div>
                    <label htmlFor="emailOrPhoneOrUsername" className="">
                        Email
                    </label>

                    <input
                        type="email"
                        name="emailOrPhoneOrUsername"
                        id="emailOrPhoneOrUsername"
                        autoComplete="email"
                        className=""
                        placeholder="name@email.com"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        required
                    />
                </div>

                <button
                    type="submit"
                    className="disabled:cursor-not-allowed disabled:opacity-50"
                    disabled={loading}
                >
                    {loading ? <Spinner /> : <span>Send Reset Link</span>}
                </button>
            </form>
        </section>
    );
};

export default ForgotPasswordContent;
