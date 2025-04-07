import PrivateRoute from "@/components/common/PrivateRoute";
import Error from "@/components/common/Error";
import AdminLayout from "@/components/admin/AdminLayout";
import AdminBlogList from "@/components/admin/AdminBlogList";
import fetchData from "@/helpers/fetchData";

export const metadata = {
    title: `Blogs - Admin | Next.js Frontend Boilerplate`,
    description: `Next JS Frontend Boilerplate`,
};

const Blogs = async () => {
    // blogs
    const blogsResponse = await fetchData(
        `${process.env.NEXT_PUBLIC_API_URL}/api/blogs`
    );
    const initialBlogs = blogsResponse?.data || [];
    const blogsError = blogsResponse?.error || null;

    // blog categories
    const blogCategoriesResponse = await fetchData(
        `${process.env.NEXT_PUBLIC_API_URL}/api/blogCategories`
    );
    const initialBlogCategories = blogCategoriesResponse?.data || [];
    const blogCategoriesError = blogCategoriesResponse?.error || null;

    // users
    const usersResponse = await fetchData(
        `${process.env.NEXT_PUBLIC_API_URL}/api/users`
    );
    const initialUsers = usersResponse?.data || [];
    const usersError = usersResponse?.error || null;

    return (
        <PrivateRoute allowedRoles={["super_admin", "admin", "moderator"]}>
            <AdminLayout>
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
            </AdminLayout>
        </PrivateRoute>
    );
};

export default Blogs;
