import PrivateRoute from "@/components/common/PrivateRoute";
import AdminLayout from "@/components/admin/AdminLayout";
import AdminUserList from "@/components/admin/AdminUserList";
import Error from "@/components/common/Error";
import fetchData from "@/helpers/fetchData";

export const metadata = {
    title: `Users - Admin | Next.js Frontend Boilerplate`,
    description: `Next JS Frontend Boilerplate`,
};

const Users = async () => {
    // users
    const usersResponse = await fetchData(
        `${process.env.NEXT_PUBLIC_API_URL}/api/users`
    );
    const initialUsers = usersResponse?.data || [];
    const usersError = usersResponse?.error || null;

    return (
        <PrivateRoute allowedRoles={["super_admin", "admin", "moderator"]}>
            <AdminLayout>
                {/* error message */}
                <section>
                    {usersError && (
                        <Error
                            errorMessage={[usersError]
                                .filter(Boolean)
                                .join("\n")}
                        />
                    )}
                </section>

                {!usersError && (
                    <section>
                        <AdminUserList initialUsers={initialUsers} />
                    </section>
                )}
            </AdminLayout>
        </PrivateRoute>
    );
};

export default Users;
