import PublicRoute from "@/components/common/PublicRoute";
import ForgotPasswordContent from "@/components/common/ForgotPasswordContent";
import UserLayout from "@/components/user/UserLayout";

export const metadata = {
    title: `Forgot Password | Next.js Frontend Boilerplate`,
    description: `Next JS Frontend Boilerplate`,
};

const ForgotPassword = () => {
    return (
        <PublicRoute>
            <UserLayout>
                <ForgotPasswordContent />
            </UserLayout>
        </PublicRoute>
    );
};

export default ForgotPassword;
