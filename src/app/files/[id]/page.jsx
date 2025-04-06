import PrivateRoute from "@/components/common/PrivateRoute";
import Error from "@/components/common/Error";
import UserLayout from "@/components/user/UserLayout";
import UserFileDetailsContent from "@/components/user/UserFileDetailsContent";
import fetchData from "@/helpers/fetchData";

export const generateMetadata = async ({ params }) => {
    const { id } = await params;

    const fileResponse = await fetchData(
        `${process.env.NEXT_PUBLIC_API_URL}/api/files/active/${id}`
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

    const fileResponse = await fetchData(
        `${process.env.NEXT_PUBLIC_API_URL}/api/files/active/${id}`
    );

    const initialFile = fileResponse?.data || null;
    const fileError = fileResponse?.error || null;

    return (
        <PrivateRoute allowedRoles={["super_admin", "admin", "moderator"]}>
            <UserLayout>
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
                        <UserFileDetailsContent
                            initialFile={initialFile}
                            id={id}
                        />
                    </section>
                )}
            </UserLayout>
        </PrivateRoute>
    );
};

export default FileDetails;
