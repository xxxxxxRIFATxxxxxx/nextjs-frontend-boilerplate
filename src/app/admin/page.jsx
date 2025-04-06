import PrivateRoute from "@/components/common/PrivateRoute";
import AdminLayout from "@/components/admin/AdminLayout";

export const metadata = {
    title: `Home - Admin | Next.js Frontend Boilerplate`,
    description: `Next JS Frontend Boilerplate`,
};

const Admin = async () => {
    return (
        <PrivateRoute allowedRoles={["super_admin", "admin", "moderator"]}>
            <AdminLayout>
                <section>Dashboard</section>
            </AdminLayout>
        </PrivateRoute>
    );
};

export default Admin;
