import PrivateRoute from "@/components/common/PrivateRoute";
import Error from "@/components/common/Error";
import UserLayout from "@/components/user/UserLayout";
import UserFileList from "@/components/user/UserFileList";
import fetchData from "@/helpers/fetchData";

export const metadata = {
    title: `Files | Next.js Frontend Boilerplate`,
    description: `Next JS Frontend Boilerplate`,
};

const Files = async () => {
    const filesResponse = await fetchData(
        `${process.env.NEXT_PUBLIC_API_URL}/api/files/active`
    );

    // extract data or error messages
    const initialFiles = filesResponse?.data || [];
    const filesError = filesResponse?.error || null;

    return (
        <PrivateRoute allowedRoles={["super_admin", "admin", "moderator"]}>
            <UserLayout>
                {/* error message */}
                <section>
                    {filesError && (
                        <Error
                            errorMessage={[filesError]
                                .filter(Boolean)
                                .join("\n")}
                        />
                    )}
                </section>

                {!filesError && (
                    <section>
                        <UserFileList initialFiles={initialFiles} />
                    </section>
                )}
            </UserLayout>
        </PrivateRoute>
    );
};

export default Files;
