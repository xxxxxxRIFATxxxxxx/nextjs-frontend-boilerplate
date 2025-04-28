import PublicRoute from "@/components/common/PublicRoute";
import LoginContent from "@/components/common/LoginContent";
import UserLayout from "@/components/user/UserLayout";

export const metadata = {
    title: `Login | Next.js Frontend Boilerplate`,
    description: `Next JS Frontend Boilerplate`,
};

const Login = () => {
    return (
        <PublicRoute>
            <UserLayout>
                <LoginContent />
            </UserLayout>
        </PublicRoute>
    );
};

export default Login;
