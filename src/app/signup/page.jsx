import Layout from "@/components/common/Layout";
import PublicRoute from "@/components/common/PublicRoute";
import SignupContent from "@/components/signup/SignupContent";

export const metadata = {
    title: "Next JS Frontend Boilerplate - Signup",
    description: "Next JS Frontend Boilerplate",
};

const Signup = () => {
    return (
        <PublicRoute>
            <Layout>
                <SignupContent />
            </Layout>
        </PublicRoute>
    );
};

export default Signup;
