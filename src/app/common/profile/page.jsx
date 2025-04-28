import PrivateRoute from "@/components/common/PrivateRoute";
import ProfileContent from "@/components/common/ProfileContent";
import UserLayout from "@/components/user/UserLayout";

export const metadata = {
    title: `Profile | Next.js Frontend Boilerplate`,
    description: `Next JS Frontend Boilerplate`,
};

const Profile = () => {
    return (
        <PrivateRoute
            allowedRoles={["super_admin", "admin", "moderator", "user"]}
        >
            <UserLayout>
                <ProfileContent />
            </UserLayout>
        </PrivateRoute>
    );
};

export default Profile;
