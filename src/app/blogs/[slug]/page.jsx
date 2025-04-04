import Layout from "@/components/common/Layout";
import PrivateRoute from "@/components/common/PrivateRoute";
import Error from "@/components/common/Error";
import BlogDetailsClient from "@/components/blogs/BlogDetailsClient";
import fetchData from "@/helpers/fetchData";

export async function generateMetadata({ params }) {
    const { slug } = await params;

    const blogResponse = await fetchData(
        `${process.env.NEXT_PUBLIC_API_URL}/api/blogs/active/slug/${slug}`
    );

    const blog = blogResponse?.data || null;
    const blogError = blogResponse?.error || null;

    if (blogError || !blog) {
        return { title: "Blog title", description: "Blog description." };
    }

    return {
        title: `Next JS Frontend Boilerplate - ${blog.title}`,
        description: `Next JS Frontend Boilerplate- ${blog?.description}`,
    };
}

const BlogDetails = async ({ params }) => {
    const { slug } = await params;

    const blogResponse = await fetchData(
        `${process.env.NEXT_PUBLIC_API_URL}/api/blogs/active/slug/${slug}`
    );

    const initialBlog = blogResponse?.data || null;
    const blogError = blogResponse?.error || null;

    return (
        <PrivateRoute
            allowedRoles={["super_admin", "admin", "moderator", "user"]}
        >
            <Layout>
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
                        <BlogDetailsClient
                            initialBlog={initialBlog}
                            slug={slug}
                        />
                    </section>
                )}
            </Layout>
        </PrivateRoute>
    );
};

export default BlogDetails;
