import Layout from "@/components/common/Layout";
import UserBlogList from "@/components/blogs/UserBlogList";
import PrivateRoute from "@/components/common/PrivateRoute";
import Error from "@/components/common/Error";
import fetchData from "@/helpers/fetchData";

const Blog = async () => {
    const blogsResponse = await fetchData(
        `${process.env.NEXT_PUBLIC_API_URL}/api/blogs`
    );

    const blogCategoriesResponse = await fetchData(
        `${process.env.NEXT_PUBLIC_API_URL}/api/blogCategories`
    );

    const usersResponse = await fetchData(
        `${process.env.NEXT_PUBLIC_API_URL}/api/users`
    );

    // extract data or error messages
    const blogs = (blogsResponse?.data || []).filter(
        (item) => item?.status === "active"
    );

    const blogCategories = (blogCategoriesResponse?.data || []).filter(
        (category) => category?.status === "active"
    );

    const users = (usersResponse?.data || []).filter(
        (user) => user?.status === "active"
    );

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
                            blogs={blogs}
                            blogCategories={blogCategories}
                            users={users}
                        />
                    </section>
                )}
            </Layout>
        </PrivateRoute>
    );
};

export default Blog;
