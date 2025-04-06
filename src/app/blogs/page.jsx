import Error from "@/components/common/Error";
import UserLayout from "@/components/user/UserLayout";
import UserBlogList from "@/components/user/UserBlogList";
import fetchData from "@/helpers/fetchData";

export const metadata = {
    title: `Blogs | Next.js Frontend Boilerplate`,
    description: `Next JS Frontend Boilerplate`,
};

const Blogs = async () => {
    const blogsResponse = await fetchData(
        `${process.env.NEXT_PUBLIC_API_URL}/api/blogs/active`
    );

    const blogCategoriesResponse = await fetchData(
        `${process.env.NEXT_PUBLIC_API_URL}/api/blogCategories/active`
    );

    const usersResponse = await fetchData(
        `${process.env.NEXT_PUBLIC_API_URL}/api/users/active`
    );

    // extract data or error messages
    const initialBlogs = blogsResponse?.data || [];
    const initialBlogCategories = blogCategoriesResponse?.data || [];
    const initialUsers = usersResponse?.data || [];

    const blogsError = blogsResponse?.error || null;
    const blogCategoriesError = blogCategoriesResponse?.error || null;
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
