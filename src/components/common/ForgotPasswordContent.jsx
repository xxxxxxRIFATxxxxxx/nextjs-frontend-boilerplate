"use client";
import { useState } from "react";
import { toast } from "react-toastify";
import Spinner from "@/components/common/Spinner";
import { useAuth } from "@/context/AuthProvider";

const ForgotPasswordContent = () => {
    const [emailOrPhoneOrUsername, setEmailOrPhoneOrUsername] = useState("");
    const [loading, setLoading] = useState(false);
    const { forgotPassword } = useAuth();

    const handleSubmit = async (e) => {
        e.preventDefault();

        setLoading(true);

        const response = await forgotPassword(emailOrPhoneOrUsername);

        if (response?.message) {
            toast.success(response.message);

            // reset form fields
            setEmailOrPhoneOrUsername("");
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
                        Email or phone or username
                    </label>

                    <input
                        type="text"
                        name="emailOrPhoneOrUsername"
                        id="emailOrPhoneOrUsername"
                        autoComplete="email"
                        className=""
                        placeholder="name@email.com"
                        value={emailOrPhoneOrUsername}
                        onChange={(e) =>
                            setEmailOrPhoneOrUsername(e.target.value)
                        }
                        required
                    />
                </div>

                <button
                    type="submit"
                    className="disabled:cursor-not-allowed disabled:opacity-50"
                    disabled={loading}
                >
                    {loading ? <Spinner /> : <span>Send reset link</span>}
                </button>
            </form>
        </section>
    );
};

export default ForgotPasswordContent;
