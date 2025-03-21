import Layout from "@/components/common/Layout";
import UserList from "@/components/users/UserList";
import PrivateRoute from "@/components/common/PrivateRoute";
import Error from "@/components/common/Error";
import fetchData from "@/helpers/fetchData";

const Users = async () => {
    const usersResponse = await fetchData(
        `${process.env.NEXT_PUBLIC_API_URL}/api/users`
    );

    // extract initial data or error messages
    const initialUsers = usersResponse?.data || [];
    const usersError = usersResponse?.error || null;

    return (
        <PrivateRoute allowedRoles={["super_admin", "admin", "moderator"]}>
            <Layout>
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
                        <UserList initialUsers={initialUsers} />
                    </section>
                )}
            </Layout>
        </PrivateRoute>
    );
};

export default Users;
