import Layout from "@/components/common/Layout";
import PrivateRoute from "@/components/common/PrivateRoute";
import ProfileContent from "@/components/profile/ProfileContent";

export const metadata = {
    title: "Next JS Frontend Boilerplate - Profile",
    description: "Next JS Frontend Boilerplate",
};

const Profile = () => {
    return (
        <PrivateRoute
            allowedRoles={["super_admin", "admin", "moderator", "user"]}
        >
            <Layout>
                <ProfileContent />
            </Layout>
        </PrivateRoute>
    );
};

export default Profile;
