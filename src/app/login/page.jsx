import Layout from "@/components/common/Layout";
import PublicRoute from "@/components/common/PublicRoute";
import LoginContent from "@/components/login/LoginContent";

export const metadata = {
    title: "Next JS Frontend Boilerplate - Login",
    description: "Next JS Frontend Boilerplate",
};

const Login = () => {
    return (
        <PublicRoute>
            <Layout>
                <LoginContent />
            </Layout>
        </PublicRoute>
    );
};

export default Login;
