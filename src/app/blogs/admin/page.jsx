import Layout from "@/components/common/Layout";
import PrivateRoute from "@/components/common/PrivateRoute";
import Error from "@/components/common/Error";
import AdminBlogList from "@/components/blogs/AdminBlogList";
import fetchData from "@/helpers/fetchData";

export const metadata = {
    title: "Next JS Frontend Boilerplate - Blogs",
    description: "Next JS Frontend Boilerplate",
};

const Admin = async () => {
    const blogsResponse = await fetchData(
        `${process.env.NEXT_PUBLIC_API_URL}/api/blogs`
    );

    const blogCategoriesResponse = await fetchData(
        `${process.env.NEXT_PUBLIC_API_URL}/api/blogCategories`
    );

    const usersResponse = await fetchData(
        `${process.env.NEXT_PUBLIC_API_URL}/api/users`
    );

    // extract initial data or error messages
    const initialBlogs = blogsResponse?.data || [];
    const initialBlogCategories = blogCategoriesResponse?.data || [];
    const initialUsers = usersResponse?.data || [];

    const blogsError = blogsResponse?.error || null;
    const blogCategoriesError = blogCategoriesResponse?.error || null;
    const usersError = usersResponse?.error || null;

    return (
        <PrivateRoute allowedRoles={["super_admin", "admin", "moderator"]}>
            <Layout>
                {/* error message */}
                <section>
                    {(blogsError || blogCategoriesError || usersError) && (
                        <Error
                            errorMessage={[
                                blogsError,
                                blogCategoriesError,
                                usersError,
                            ]
                                .filter(Boolean)
                                .join("\n")}
                        />
                    )}
                </section>

                {!blogsError && !blogCategoriesError && !usersError && (
                    <section>
                        <AdminBlogList
                            initialBlogs={initialBlogs}
                            initialBlogCategories={initialBlogCategories}
                            initialUsers={initialUsers}
                        />
                    </section>
                )}
            </Layout>
        </PrivateRoute>
    );
};

export default Admin;
