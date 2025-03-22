import Layout from "@/components/common/Layout";
import UserBlogList from "@/components/blogs/UserBlogList";
import PrivateRoute from "@/components/common/PrivateRoute";
import Error from "@/components/common/Error";
import fetchData from "@/helpers/fetchData";

const Blogs = async () => {
    const blogsResponse = await fetchData(
        `${process.env.NEXT_PUBLIC_API_URL}/api/blogs/get/only/active`
    );

    const blogCategoriesResponse = await fetchData(
        `${process.env.NEXT_PUBLIC_API_URL}/api/blogCategories/get/only/active`
    );

    const usersResponse = await fetchData(
        `${process.env.NEXT_PUBLIC_API_URL}/api/users/get/only/active`
    );

    // extract data or error messages
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
                        <UserBlogList
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

export default Blogs;
