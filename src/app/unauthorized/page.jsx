import Link from "next/link";

export const metadata = {
    title: "Next JS Frontend Boilerplate - Unauthorized",
    description: "Next JS Frontend Boilerplate",
};

const Unauthorized = () => {
    return (
        <section>
            <h1>Unauthorized</h1>
            <Link href="/">Go Home</Link>
        </section>
    );
};

export default Unauthorized;
