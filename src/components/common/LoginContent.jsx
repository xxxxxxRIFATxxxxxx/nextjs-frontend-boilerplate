"use client";
import { useState } from "react";
import Link from "next/link";
import { toast } from "react-toastify";
import Spinner from "@/components/common/Spinner";
import { useAuth } from "@/context/AuthProvider";

const LoginContent = () => {
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

            // reset form fields
            setEmailOrPhoneOrUsername("");
            setPassword("");
        } else {
            toast.error(response);
        }

        setLoading(false);
    };

    return (
        <section className="h-screen">
            <h1>Login to your account</h1>

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
                <div>
                    <label htmlFor="password" className="">
                        Password
                    </label>
                    <input
                        type="password"
                        name="password"
                        id="password"
                        autoComplete="new-password"
                        className=""
                        placeholder="••••••••"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        required
                    />
                </div>

                <button
                    type="submit"
                    className="disabled:cursor-not-allowed disabled:opacity-50"
                    disabled={loading}
                >
                    {loading ? <Spinner /> : <span>Login</span>}
                </button>

                <div>
                    <Link href="/forgot-password" className="">
                        Forgot password?
                    </Link>
                </div>

                <p className="">
                    Don’t have an account yet?{" "}
                    <Link href="/signup" className="">
                        Sign up
                    </Link>
                </p>
            </form>
        </section>
    );
};

export default LoginContent;
