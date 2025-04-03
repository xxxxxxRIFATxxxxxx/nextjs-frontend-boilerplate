import Layout from "@/components/common/Layout";
import PublicRoute from "@/components/common/PublicRoute";
import ResetPasswordContent from "@/components/resetPassword/ResetPasswordContent";

export const metadata = {
    title: "Next JS Frontend Boilerplate - Reset Password",
    description: "Next JS Frontend Boilerplate",
};

const ResetPassword = () => {
    return (
        <PublicRoute>
            <Layout>
                <ResetPasswordContent />
            </Layout>
        </PublicRoute>
    );
};

export default ResetPassword;
