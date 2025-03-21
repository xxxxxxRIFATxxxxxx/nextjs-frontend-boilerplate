import Layout from "@/components/common/Layout";
import BlogCategoryList from "@/components/blogCategories/BlogCategoryList";
import PrivateRoute from "@/components/common/PrivateRoute";
import Error from "@/components/common/Error";
import fetchData from "@/helpers/fetchData";

const BlogCategories = async () => {
    const blogCategoriesResponse = await fetchData(
        `${process.env.NEXT_PUBLIC_API_URL}/api/blogCategories`
    );

    // extract initial data or error messages
    const initialBlogCategories = blogCategoriesResponse?.data || [];
    const blogCategoriesError = blogCategoriesResponse?.error || null;

    return (
        <PrivateRoute allowedRoles={["super_admin", "admin", "moderator"]}>
            <Layout>
                {/* error message */}
                <section>
                    {blogCategoriesError && (
                        <Error
                            errorMessage={[blogCategoriesError]
                                .filter(Boolean)
                                .join("\n")}
                        />
                    )}
                </section>

                {!blogCategoriesError && (
                    <section>
                        <BlogCategoryList
                            initialBlogCategories={initialBlogCategories}
                        />
                    </section>
                )}
            </Layout>
        </PrivateRoute>
    );
};

export default BlogCategories;
