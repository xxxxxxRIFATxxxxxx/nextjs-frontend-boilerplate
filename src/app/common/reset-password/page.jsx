import PublicRoute from "@/components/common/PublicRoute";
import ResetPasswordContent from "@/components/common/ResetPasswordContent";
import UserLayout from "@/components/user/UserLayout";

export const metadata = {
    title: `Reset Password | Next.js Frontend Boilerplate`,
    description: `Next JS Frontend Boilerplate`,
};

const ResetPassword = () => {
    return (
        <PublicRoute>
            <UserLayout>
                <ResetPasswordContent />
            </UserLayout>
        </PublicRoute>
    );
};

export default ResetPassword;
