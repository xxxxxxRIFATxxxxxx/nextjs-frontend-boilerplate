import { redirect } from "next/navigation";

export const metadata = {
    title: `Home | Next.js Frontend Boilerplate`,
    description: `Next JS Frontend Boilerplate`,
};

const Home = async () => {
    redirect("/user");
};

export default Home;
