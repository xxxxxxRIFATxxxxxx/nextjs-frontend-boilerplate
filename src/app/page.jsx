import Layout from "@/components/common/Layout";

export const metadata = {
    title: "Next JS Frontend Boilerplate - Home",
    description: "Next JS Frontend Boilerplate",
};

const Home = async () => {
    return (
        <Layout>
            <section className="h-screen">Home</section>
        </Layout>
    );
};

export default Home;
