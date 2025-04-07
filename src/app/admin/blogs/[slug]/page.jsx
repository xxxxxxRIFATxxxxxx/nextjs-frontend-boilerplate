import PrivateRoute from "@/components/common/PrivateRoute";
import Error from "@/components/common/Error";
import AdminLayout from "@/components/admin/AdminLayout";
import AdminBlogDetailsContent from "@/components/admin/AdminBlogDetailsContent";
import fetchData from "@/helpers/fetchData";

export const generateMetadata = async ({ params }) => {
    const { slug } = await params;

    // blog
    const blogResponse = await fetchData(
        `${process.env.NEXT_PUBLIC_API_URL}/api/blogs/slug/${slug}`
    );
    const blog = blogResponse?.data || null;
    const blogError = blogResponse?.error || null;

    if (blogError || !blog) {
        return {
            title: `Blog title | Next.js Frontend Boilerplate`,
            description: `Blog description | Next.js Frontend Boilerplate.`,
        };
    }

    return {
        title: `${blog?.title} | Next.js Frontend Boilerplate`,
        description: `${blog?.description} | Next.js Frontend Boilerplate.`,
    };
};

const BlogDetails = async ({ params }) => {
    const { slug } = await params;

    // blog
    const blogResponse = await fetchData(
        `${process.env.NEXT_PUBLIC_API_URL}/api/blogs/slug/${slug}`
    );
    const initialBlog = blogResponse?.data || null;
    const blogError = blogResponse?.error || null;

    return (
        <PrivateRoute allowedRoles={["super_admin", "admin", "moderator"]}>
            <AdminLayout>
                {/* error message */}
                <section>
                    {blogError && (
                        <Error
                            errorMessage={[blogError]
                                .filter(Boolean)
                                .join("\n")}
                        />
                    )}
                </section>

                {!blogError && (
                    <section>
                        <AdminBlogDetailsContent
                            initialBlog={initialBlog}
                            slug={slug}
                        />
                    </section>
                )}
            </AdminLayout>
        </PrivateRoute>
    );
};

export default BlogDetails;
