import Layout from "@/components/common/Layout";
import Error from "@/components/common/Error";
import BlogDetailsClient from "@/components/blogs/BlogDetailsClient";
import fetchData from "@/helpers/fetchData";

export async function generateMetadata({ params }) {
    const { slug } = await params;

    const blogResponse = await fetchData(
        `${process.env.NEXT_PUBLIC_API_URL}/api/blogs/get/only/active/slug/${slug}`
    );

    const blog = blogResponse?.data || null;
    const blogError = blogResponse?.error || null;

    if (blogError || !blog) {
        return { title: "Blog title", description: "Blog description." };
    }

    return {
        title: `${blog.title}`,
        description: blog?.description,
    };
}

const BlogDetails = async ({ params }) => {
    const { slug } = await params;

    const blogResponse = await fetchData(
        `${process.env.NEXT_PUBLIC_API_URL}/api/blogs/get/only/active/slug/${slug}`
    );

    const initialBlog = blogResponse?.data || null;
    const blogError = blogResponse?.error || null;

    return (
        <Layout>
            {/* error message */}
            <section>
                {blogError && (
                    <Error
                        errorMessage={[blogError].filter(Boolean).join("\n")}
                    />
                )}
            </section>

            {!blogError && (
                <section>
                    <BlogDetailsClient initialBlog={initialBlog} slug={slug} />
                </section>
            )}
        </Layout>
    );
};

export default BlogDetails;
