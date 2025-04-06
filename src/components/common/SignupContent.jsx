"use client";
import { useState } from "react";
import Link from "next/link";
import { toast } from "react-toastify";
import Spinner from "@/components/common/Spinner";
import { useAuth } from "@/context/AuthProvider";

const SignupContent = () => {
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

            // reset form fields
            setFullName("");
            setEmail("");
            setPhone("");
            setUsername("");
            setPassword("");
            setAcceptedTerms(false);
        } else {
            toast.error(response);
        }

        setLoading(false);
    };

    return (
        <section className="h-screen ">
            <h1>Create an account</h1>

            <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                    <label htmlFor="fullName" className="">
                        Full name
                    </label>

                    <input
                        type="text"
                        name="fullName"
                        id="fullName"
                        autoComplete="name"
                        className=""
                        placeholder="Full Name"
                        value={fullName}
                        onChange={(e) => setFullName(e.target.value)}
                        required
                    />
                </div>

                <div>
                    <label htmlFor="email" className="">
                        Email
                    </label>

                    <input
                        type="email"
                        name="email"
                        id="email"
                        autoComplete="email"
                        className=""
                        placeholder="name@email.com"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        required
                    />
                </div>

                <div>
                    <label htmlFor="phone" className="">
                        Phone
                    </label>

                    <input
                        type="tel"
                        name="phone"
                        id="phone"
                        autoComplete="tel"
                        className=""
                        placeholder="+8801XXXXXXXXX"
                        value={phone}
                        onChange={(e) => setPhone(e.target.value)}
                        required
                    />
                </div>

                <div>
                    <label htmlFor="username" className="">
                        Username
                    </label>

                    <input
                        type="text"
                        name="username"
                        id="username"
                        autoComplete="username"
                        className=""
                        placeholder="Username"
                        value={username}
                        onChange={(e) => setUsername(e.target.value)}
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

                <div>
                    <input
                        type="checkbox"
                        name="terms-and-conditions"
                        id="terms-and-conditions"
                        className=""
                        checked={acceptedTerms}
                        onChange={(e) => setAcceptedTerms(e.target.checked)}
                        required
                    />

                    <label htmlFor="terms-and-conditions" className="">
                        I accept the{" "}
                        <Link href="/terms-and-conditions" target="_blank">
                            Terms and conditions
                        </Link>
                    </label>
                </div>

                <button
                    type="submit"
                    className="disabled:cursor-not-allowed disabled:opacity-50"
                    disabled={loading}
                >
                    {loading ? <Spinner /> : <span>Create an account</span>}
                </button>

                <p className="">
                    Already have an account?{" "}
                    <Link href="/login" className="">
                        Login
                    </Link>
                </p>
            </form>
        </section>
    );
};

export default SignupContent;
