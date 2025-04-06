import Link from "next/link";
import UserLayout from "@/components/user/UserLayout";

const NotFound = () => {
    return (
        <UserLayout>
            <section>
                <p>Not found</p>
                <Link href="/">Go home</Link>
            </section>
        </UserLayout>
    );
};

export default NotFound;
