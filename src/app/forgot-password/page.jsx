import Layout from "@/components/common/Layout";
import PublicRoute from "@/components/common/PublicRoute";
import ForgotPasswordContent from "@/components/forgot-password/ForgotPasswordContent";

export const metadata = {
    title: "Next JS Frontend Boilerplate - Forgot Password",
    description: "Next JS Frontend Boilerplate",
};

const ForgotPassword = () => {
    return (
        <PublicRoute>
            <Layout>
                <ForgotPasswordContent />
            </Layout>
        </PublicRoute>
    );
};

export default ForgotPassword;
