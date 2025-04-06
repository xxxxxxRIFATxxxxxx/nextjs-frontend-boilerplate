import PrivateRoute from "@/components/common/PrivateRoute";
import Error from "@/components/common/Error";
import UserLayout from "@/components/user/UserLayout";
import UserUserList from "@/components/user/UserUserList";
import fetchData from "@/helpers/fetchData";

export const metadata = {
    title: `Users | Next.js Frontend Boilerplate`,
    description: `Next JS Frontend Boilerplate`,
};

const Users = async () => {
    const usersResponse = await fetchData(
        `${process.env.NEXT_PUBLIC_API_URL}/api/users/active`
    );

    // extract data or error messages
    const initialUsers = usersResponse?.data || [];
    const usersError = usersResponse?.error || null;

    return (
        <PrivateRoute allowedRoles={["super_admin", "admin", "moderator"]}>
            <UserLayout>
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
                        <UserUserList initialUsers={initialUsers} />
                    </section>
                )}
            </UserLayout>
        </PrivateRoute>
    );
};

export default Users;
