"use client";
import Layout from "@/components/common/Layout";
import { useAuth } from "@/context/AuthProvider";

const Home = () => {
    const { logout } = useAuth();
    return (
        <Layout>
            <section className="h-screen">
                Home
                <button onClick={logout}>Logout</button>
            </section>
        </Layout>
    );
};

export default Home;
