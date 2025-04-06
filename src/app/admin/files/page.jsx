import PrivateRoute from "@/components/common/PrivateRoute";
import Error from "@/components/common/Error";
import AdminLayout from "@/components/admin/AdminLayout";
import AdminFileList from "@/components/admin/AdminFileList";
import fetchData from "@/helpers/fetchData";

export const metadata = {
    title: `Files - Admin | Next.js Frontend Boilerplate`,
    description: `Next JS Frontend Boilerplate`,
};

const Files = async () => {
    const filesResponse = await fetchData(
        `${process.env.NEXT_PUBLIC_API_URL}/api/files`
    );

    // extract initial data or error messages
    const initialFiles = filesResponse?.data || [];
    const filesError = filesResponse?.error || null;

    return (
        <PrivateRoute allowedRoles={["super_admin", "admin", "moderator"]}>
            <AdminLayout>
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
                        <AdminFileList initialFiles={initialFiles} />
                    </section>
                )}
            </AdminLayout>
        </PrivateRoute>
    );
};

export default Files;
