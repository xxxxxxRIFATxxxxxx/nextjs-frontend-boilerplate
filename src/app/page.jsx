import UserLayout from "@/components/user/UserLayout";

export const metadata = {
    title: `Home | Next.js Frontend Boilerplate`,
    description: `Next JS Frontend Boilerplate`,
};

const Home = async () => {
    return (
        <UserLayout>
            <section className="h-screen">
                <p>Home</p>
            </section>
        </UserLayout>
    );
};

export default Home;
