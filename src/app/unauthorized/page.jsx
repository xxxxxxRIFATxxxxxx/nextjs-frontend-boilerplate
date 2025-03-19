import Link from "next/link";

const Unauthorized = () => {
    return (
        <section>
            <h1>Unauthorized</h1>
            <Link href="/">Go Home</Link>
        </section>
    );
};

export default Unauthorized;
