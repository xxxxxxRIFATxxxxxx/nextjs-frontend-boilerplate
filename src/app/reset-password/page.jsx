"use client";
import Layout from "@/components/common/Layout";
import PublicRoute from "@/components/common/PublicRoute";
import ResetPasswordContent from "@/components/resetPassword/ResetPasswordContent";

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
