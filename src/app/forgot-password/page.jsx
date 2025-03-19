"use client";
import { useState } from "react";
import { toast } from "react-toastify";
import { useAuth } from "@/context/AuthProvider";
import Layout from "@/components/common/Layout";
import Spinner from "@/components/common/Spinner";
import PublicRoute from "@/components/common/PublicRoute";

const ForgotPassword = () => {
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
        <PublicRoute>
            <Layout>
                {/* <main>
                    <div className="flex justify-center items-center m-4 md:my-40">
                        <div className="bg-white rounded-[10px] border-2 border-color7 p-6 w-full md:w-96 space-y-4">
                            <div className="text-center">
                                <H4> Forgot Password</H4>
                            </div>

                            <form onSubmit={handleSubmit} className="space-y-4">
                                <div>
                                    <label className="block text-gray-700">
                                        Enter your email
                                    </label>

                                    <Input
                                        type="email"
                                        placeholder="Enter your email"
                                        value={email}
                                        onChange={(e) =>
                                            setEmail(e.target.value)
                                        }
                                        required={true}
                                    />
                                </div>

                                <PrimaryButton
                                    customClassName="w-full"
                                    disabled={loading}
                                    type="submit"
                                >
                                    {loading ? "Sending..." : "Send Reset Link"}
                                </PrimaryButton>
                            </form>
                        </div>
                    </div>
                </main> */}

                <section className="h-screen">
                    <h1>Forgot Password</h1>

                    <form onSubmit={handleSubmit}>
                        <div>
                            <label
                                htmlFor="emailOrPhoneOrUsername"
                                className=""
                            >
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

                        <button type="submit" className="" disabled={loading}>
                            {loading ? (
                                <Spinner />
                            ) : (
                                <span>Send Reset Link</span>
                            )}
                        </button>
                    </form>
                </section>
            </Layout>
        </PublicRoute>
    );
};

export default ForgotPassword;
