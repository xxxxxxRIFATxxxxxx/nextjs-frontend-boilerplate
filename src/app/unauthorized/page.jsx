import Link from "next/link";

const Unauthorized = () => {
    return (
        <section>
            <h1>Unauthorized</h1>
            <Link href="/">Back</Link>
        </section>
    );
};

export default Unauthorized;
