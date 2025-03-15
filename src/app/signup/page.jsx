"use client";
import { useState } from "react";
import Link from "next/link";
import { toast } from "react-toastify";
import { useAuth } from "@/context/AuthProvider";
import Layout from "@/components/common/Layout";
import Spinner from "@/components/common/Spinner";
import PublicRoute from "@/components/common/PublicRoute";

const Signup = () => {
    const { signup } = useAuth();
    const [fullName, setFullName] = useState("");
    const [email, setEmail] = useState("");
    const [phone, setPhone] = useState("");
    const [username, setUsername] = useState("");
    const [password, setPassword] = useState("");
    const [loading, setLoading] = useState(false);
    const [acceptedTerms, setAcceptedTerms] = useState(false);

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (!acceptedTerms) {
            toast.error(
                "You must agree to the terms and conditions to create an account."
            );
            return;
        }

        setLoading(true);

        const response = await signup({
            fullName,
            email,
            phone,
            username,
            password,
        });

        if (response?.data) {
            toast.success(response.message);

            // reset form fields after successful signup
            setFullName("");
            setEmail("");
            setPhone("");
            setUsername("");
            setPassword("");
            setAcceptedTerms(false);
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
                                Create an account
                            </h1>

                            <form onSubmit={handleSubmit} className="space-y-4">
                                <div>
                                    <label
                                        htmlFor="fullName"
                                        className="block mb-2 text-sm font-medium text-black"
                                    >
                                        Full Name
                                    </label>

                                    <input
                                        type="text"
                                        name="fullName"
                                        id="fullName"
                                        autoComplete="name"
                                        className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-black focus:border-black block w-full p-3"
                                        placeholder="Full Name"
                                        value={fullName}
                                        onChange={(e) =>
                                            setFullName(e.target.value)
                                        }
                                        required
                                    />
                                </div>

                                <div>
                                    <label
                                        htmlFor="email"
                                        className="block mb-2 text-sm font-medium text-black"
                                    >
                                        Email
                                    </label>
                                    <input
                                        type="email"
                                        name="email"
                                        id="email"
                                        autoComplete="email"
                                        className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-black focus:border-black block w-full p-3"
                                        placeholder="name@email.com"
                                        value={email}
                                        onChange={(e) =>
                                            setEmail(e.target.value)
                                        }
                                        required
                                    />
                                </div>

                                <div>
                                    <label
                                        htmlFor="phone"
                                        className="block mb-2 text-sm font-medium text-black"
                                    >
                                        Phone
                                    </label>
                                    <input
                                        type="tel"
                                        name="phone"
                                        id="phone"
                                        autoComplete="tel"
                                        className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-black focus:border-black block w-full p-3"
                                        placeholder="+8801XXXXXXXXX"
                                        value={phone}
                                        onChange={(e) =>
                                            setPhone(e.target.value)
                                        }
                                        required
                                    />
                                </div>

                                <div>
                                    <label
                                        htmlFor="username"
                                        className="block mb-2 text-sm font-medium text-black"
                                    >
                                        Username
                                    </label>
                                    <input
                                        type="text"
                                        name="username"
                                        id="username"
                                        autoComplete="username"
                                        className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-black focus:border-black block w-full p-3"
                                        placeholder="Username"
                                        value={username}
                                        onChange={(e) =>
                                            setUsername(e.target.value)
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

                                <div className="flex items-start space-x-2">
                                    <div className="flex items-center h-5">
                                        <input
                                            id="terms-and-conditions"
                                            type="checkbox"
                                            className="w-4 h-4 border border-gray-300 rounded bg-gray-50 accent-black"
                                            checked={acceptedTerms}
                                            onChange={(e) =>
                                                setAcceptedTerms(
                                                    e.target.checked
                                                )
                                            }
                                            required
                                        />
                                    </div>

                                    <div className="text-sm">
                                        <label
                                            htmlFor="terms-and-conditions"
                                            className="font-light text-gray-500"
                                        >
                                            I accept the{" "}
                                            <Link
                                                className="font-medium text-black hover:underline"
                                                href="/terms-and-conditions"
                                            >
                                                Terms and Conditions
                                            </Link>
                                        </label>
                                    </div>
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
                                    Already have an account?{" "}
                                    <Link
                                        href="/login"
                                        className="font-medium text-black hover:underline"
                                    >
                                        Login
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

export default Signup;
