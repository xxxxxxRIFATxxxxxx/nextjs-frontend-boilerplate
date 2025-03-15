"use client";
import { useState } from "react";
import Link from "next/link";
import { toast } from "react-toastify";
import { useAuth } from "@/context/AuthProvider";
import Layout from "@/components/common/Layout";
import Spinner from "@/components/common/Spinner";
import PublicRoute from "@/components/common/PublicRoute";

const Login = () => {
    const { login } = useAuth();
    const [emailOrPhoneOrUsername, setEmailOrPhoneOrUsername] = useState("");
    const [password, setPassword] = useState("");
    const [loading, setLoading] = useState(false);

    const handleSubmit = async (e) => {
        e.preventDefault();

        setLoading(true);

        const response = await login(emailOrPhoneOrUsername, password);

        if (response?.data) {
            toast.success(response.message);

            // reset form fields after successful signup
            setEmailOrPhoneOrUsername("");
            setPassword("");
        } else {
            toast.error(response?.message || response);
        }

        setLoading(false);
    };

    return (
        <PublicRoute>
            <Layout>
                <section className="h-screen flex items-center justify-center p-4">
                    <div className="w-full md:w-[400px] p-6 border border-gray-100 bg-white rounded-lg shadow">
                        <div className="space-y-4">
                            <h1 className="text-xl md:text-2xl font-bold leading-tight tracking-tight text-black">
                                Login to your account
                            </h1>

                            <form onSubmit={handleSubmit} className="space-y-4">
                                <div>
                                    <label
                                        htmlFor="emailOrPhoneOrUsername"
                                        className="block mb-2 text-sm font-medium text-black"
                                    >
                                        Email
                                    </label>
                                    <input
                                        type="text"
                                        name="emailOrPhoneOrUsername"
                                        id="emailOrPhoneOrUsername"
                                        autoComplete="email"
                                        className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-black focus:border-black block w-full p-3"
                                        placeholder="name@email.com"
                                        value={emailOrPhoneOrUsername}
                                        onChange={(e) =>
                                            setEmailOrPhoneOrUsername(
                                                e.target.value
                                            )
                                        }
                                        required
                                    />
                                </div>

                                <div>
                                    <label
                                        htmlFor="password"
                                        className="block mb-2 text-sm font-medium text-black"
                                    >
                                        Password
                                    </label>
                                    <input
                                        type="password"
                                        name="password"
                                        id="password"
                                        autoComplete="new-password"
                                        placeholder="••••••••"
                                        className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-black focus:border-black block w-full p-3"
                                        value={password}
                                        onChange={(e) =>
                                            setPassword(e.target.value)
                                        }
                                        required
                                    />
                                </div>

                                <button
                                    type="submit"
                                    className="w-full text-white bg-black hover:bg-gray-900 focus:ring-4 focus:outline-none focus:ring-primary-300 font-medium rounded-lg text-sm px-5 py-3 text-center flex items-center justify-center cursor-pointer"
                                    disabled={loading}
                                >
                                    {loading ? (
                                        <Spinner />
                                    ) : (
                                        <span>Create an account</span>
                                    )}
                                </button>

                                <p className="text-sm font-light text-gray-500">
                                    Don’t have an account yet?{" "}
                                    <Link
                                        href="/signup"
                                        className="font-medium text-black hover:underline"
                                    >
                                        Sign up
                                    </Link>
                                </p>
                            </form>
                        </div>
                    </div>
                </section>
            </Layout>
        </PublicRoute>
    );
};

export default Login;
