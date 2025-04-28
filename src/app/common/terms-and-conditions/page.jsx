import UserLayout from "@/components/user/UserLayout";

export const metadata = {
    title: `Terms & Conditions | Next.js Frontend Boilerplate`,
    description: `Next JS Frontend Boilerplate`,
};

const TermsAndConditions = async () => {
    return (
        <UserLayout>
            <section>
                <p>Terms & conditions</p>
            </section>
        </UserLayout>
    );
};

export default TermsAndConditions;
