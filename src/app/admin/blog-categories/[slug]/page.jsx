import PrivateRoute from "@/components/common/PrivateRoute";
import Error from "@/components/common/Error";
import AdminLayout from "@/components/admin/AdminLayout";
import AdminBlogCategoryDetailsContent from "@/components/admin/AdminBlogCategoryDetailsContent";
import fetchData from "@/helpers/fetchData";

export const generateMetadata = async ({ params }) => {
    const { slug } = await params;

    // blog category
    const blogCategoryResponse = await fetchData(
        `${process.env.NEXT_PUBLIC_API_URL}/api/blogCategories/slug/${slug}`
    );
    const blogCategory = blogCategoryResponse?.data || null;
    const blogCategoryError = blogCategoryResponse?.error || null;

    if (blogCategoryError || !blogCategory) {
        return {
            title: `Blog category title | Next.js Frontend Boilerplate`,
            description: `Blog category title | Next.js Frontend Boilerplate.`,
        };
    }

    return {
        title: `${blogCategory?.title} | Next.js Frontend Boilerplate`,
        description: `${blogCategory?.title} | Next.js Frontend Boilerplate.`,
    };
};

const BlogCategoryDetails = async ({ params }) => {
    const { slug } = await params;

    // blog category
    const blogCategoryResponse = await fetchData(
        `${process.env.NEXT_PUBLIC_API_URL}/api/blogCategories/slug/${slug}`
    );
    const initialBlogCategory = blogCategoryResponse?.data || null;
    const blogCategoryError = blogCategoryResponse?.error || null;

    return (
        <PrivateRoute allowedRoles={["super_admin", "admin", "moderator"]}>
            <AdminLayout>
                {/* error message */}
                <section>
                    {blogCategoryError && (
                        <Error
                            errorMessage={[blogCategoryError]
                                .filter(Boolean)
                                .join("\n")}
                        />
                    )}
                </section>

                {!blogCategoryError && (
                    <section>
                        <AdminBlogCategoryDetailsContent
                            initialBlogCategory={initialBlogCategory}
                            slug={slug}
                        />
                    </section>
                )}
            </AdminLayout>
        </PrivateRoute>
    );
};

export default BlogCategoryDetails;
