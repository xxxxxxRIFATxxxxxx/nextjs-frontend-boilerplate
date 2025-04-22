import PrivateRoute from "@/components/common/PrivateRoute";
import Error from "@/components/common/Error";
import AdminLayout from "@/components/admin/AdminLayout";
import AdminBlogCategoryList from "@/components/admin/AdminBlogCategoryList";
import fetchData from "@/helpers/fetchData";

export const metadata = {
    title: `Blog Categories - Admin | Next.js Frontend Boilerplate`,
    description: `Next JS Frontend Boilerplate`,
};

const BlogCategories = async () => {
    // blog categories
    const blogCategoriesResponse = await fetchData(
        `${process.env.NEXT_PUBLIC_API_URL}/api/blogCategories`
    );
    const initialBlogCategories = blogCategoriesResponse?.data || [];
    const blogCategoriesError = blogCategoriesResponse?.error || null;

    return (
        <PrivateRoute allowedRoles={["super_admin", "admin", "moderator"]}>
            <AdminLayout>
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
                    <AdminBlogCategoryList
                        initialBlogCategories={initialBlogCategories}
                    />
                )}
            </AdminLayout>
        </PrivateRoute>
    );
};

export default BlogCategories;
