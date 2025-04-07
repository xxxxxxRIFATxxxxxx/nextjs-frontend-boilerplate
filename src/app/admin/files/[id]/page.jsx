import PrivateRoute from "@/components/common/PrivateRoute";
import Error from "@/components/common/Error";
import AdminLayout from "@/components/admin/AdminLayout";
import AdminFileDetailsContent from "@/components/admin/AdminFileDetailsContent";
import fetchData from "@/helpers/fetchData";

export const generateMetadata = async ({ params }) => {
    const { id } = await params;

    // file
    const fileResponse = await fetchData(
        `${process.env.NEXT_PUBLIC_API_URL}/api/files/${id}`
    );
    const file = fileResponse?.data || null;
    const fileError = fileResponse?.error || null;

    if (fileError || !file) {
        return {
            title: `File title | Next.js Frontend Boilerplate`,
            description: `File title | Next.js Frontend Boilerplate.`,
        };
    }

    return {
        title: `${file?.title} | Next.js Frontend Boilerplate`,
        description: `${file?.title} | Next.js Frontend Boilerplate.`,
    };
};

const FileDetails = async ({ params }) => {
    const { id } = await params;

    // file
    const fileResponse = await fetchData(
        `${process.env.NEXT_PUBLIC_API_URL}/api/files/${id}`
    );
    const initialFile = fileResponse?.data || null;
    const fileError = fileResponse?.error || null;

    return (
        <PrivateRoute allowedRoles={["super_admin", "admin", "moderator"]}>
            <AdminLayout>
                {/* error message */}
                <section>
                    {fileError && (
                        <Error
                            errorMessage={[fileError]
                                .filter(Boolean)
                                .join("\n")}
                        />
                    )}
                </section>

                {!fileError && (
                    <section>
                        <AdminFileDetailsContent
                            initialFile={initialFile}
                            id={id}
                        />
                    </section>
                )}
            </AdminLayout>
        </PrivateRoute>
    );
};

export default FileDetails;
