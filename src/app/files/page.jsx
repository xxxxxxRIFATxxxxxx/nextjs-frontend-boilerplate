import Layout from "@/components/common/Layout";
import PrivateRoute from "@/components/common/PrivateRoute";
import Error from "@/components/common/Error";
import FileList from "@/components/files/FileList";
import fetchData from "@/helpers/fetchData";

export const metadata = {
    title: "Next JS Frontend Boilerplate - Files",
    description: "Next JS Frontend Boilerplate",
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
            <Layout>
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
                        <FileList initialFiles={initialFiles} />
                    </section>
                )}
            </Layout>
        </PrivateRoute>
    );
};

export default Files;
