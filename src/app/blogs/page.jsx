import Error from "@/components/common/Error";
import UserLayout from "@/components/user/UserLayout";
import UserBlogList from "@/components/user/UserBlogList";
import fetchData from "@/helpers/fetchData";

export const metadata = {
    title: `Blogs | Next.js Frontend Boilerplate`,
    description: `Next JS Frontend Boilerplate`,
};

const Blogs = async () => {
    // blogs
    const blogsResponse = await fetchData(
        `${process.env.NEXT_PUBLIC_API_URL}/api/blogs/active`
    );
    const initialBlogs = blogsResponse?.data || [];
    const blogsError = blogsResponse?.error || null;

    // blog categories
    const blogCategoriesResponse = await fetchData(
        `${process.env.NEXT_PUBLIC_API_URL}/api/blogCategories/active`
    );
    const initialBlogCategories = blogCategoriesResponse?.data || [];
    const blogCategoriesError = blogCategoriesResponse?.error || null;

    // users
    const usersResponse = await fetchData(
        `${process.env.NEXT_PUBLIC_API_URL}/api/users/active`
    );
    const initialUsers = usersResponse?.data || [];
    const usersError = usersResponse?.error || null;

    return (
        <UserLayout>
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
        </UserLayout>
    );
};

export default Blogs;
