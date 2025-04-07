import PrivateRoute from "@/components/common/PrivateRoute";
import Error from "@/components/common/Error";
import UserLayout from "@/components/user/UserLayout";
import UserUserDetailsContent from "@/components/user/UserUserDetailsContent";
import fetchData from "@/helpers/fetchData";

export const generateMetadata = async ({ params }) => {
    const { id } = await params;

    // user
    const userResponse = await fetchData(
        `${process.env.NEXT_PUBLIC_API_URL}/api/users/active/${id}`
    );
    const user = userResponse?.data || null;
    const userError = userResponse?.error || null;

    if (userError || !user) {
        return {
            title: "User email",
            description: "User bio.",
        };
    }

    return {
        title: `${user?.email} | Next.js Frontend Boilerplate`,
        description: `${user?.bio} | Next.js Frontend Boilerplate.`,
    };
};

const UserDetails = async ({ params }) => {
    const { id } = await params;

    // user
    const userResponse = await fetchData(
        `${process.env.NEXT_PUBLIC_API_URL}/api/users/active/${id}`
    );
    const initialUser = userResponse?.data || null;
    const userError = userResponse?.error || null;

    return (
        <PrivateRoute allowedRoles={["super_admin", "admin", "moderator"]}>
            <UserLayout>
                {/* error message */}
                <section>
                    {userError && (
                        <Error
                            errorMessage={[userError]
                                .filter(Boolean)
                                .join("\n")}
                        />
                    )}
                </section>

                {!userError && (
                    <section>
                        <UserUserDetailsContent
                            initialUser={initialUser}
                            id={id}
                        />
                    </section>
                )}
            </UserLayout>
        </PrivateRoute>
    );
};

export default UserDetails;
