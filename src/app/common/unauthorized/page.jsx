import Link from "next/link";

export const metadata = {
    title: `Unauthorized | Next.js Frontend Boilerplate`,
    description: `Next JS Frontend Boilerplate`,
};

const Unauthorized = () => {
    return (
        <section>
            <p>Unauthorized</p>
            <Link href="/">Go home</Link>
        </section>
    );
};

export default Unauthorized;
