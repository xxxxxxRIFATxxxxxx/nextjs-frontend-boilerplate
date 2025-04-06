import PublicRoute from "@/components/common/PublicRoute";
import SignupContent from "@/components/common/SignupContent";
import UserLayout from "@/components/user/UserLayout";

export const metadata = {
    title: `Signup | Next.js Frontend Boilerplate`,
    description: `Next JS Frontend Boilerplate`,
};

const Signup = () => {
    return (
        <PublicRoute>
            <UserLayout>
                <SignupContent />
            </UserLayout>
        </PublicRoute>
    );
};

export default Signup;
