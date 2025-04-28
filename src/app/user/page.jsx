import UserHomeContent from "@/components/user/UserHomeContent";
import UserLayout from "@/components/user/UserLayout";
import fetchData from "@/helpers/fetchData";

export const metadata = {
    title: `Home | Next.js Frontend Boilerplate`,
    description: `Next JS Frontend Boilerplate`,
};

const User = async () => {
    // blog categories
    const blogCategoriesResponse = await fetchData(
        `${process.env.NEXT_PUBLIC_API_URL}/api/blogCategories/active`
    );
    const initialBlogCategories = blogCategoriesResponse?.data || [];
    const blogCategoriesError = blogCategoriesResponse?.error || null;

    // blogs
    const blogsResponse = await fetchData(
        `${process.env.NEXT_PUBLIC_API_URL}/api/blogs/active`
    );
    const initialBlogs = blogsResponse?.data || [];
    const blogsError = blogsResponse?.error || null;

    return (
        <UserLayout>
            {/* error message */}
            <section>
                {(blogCategoriesError || blogsError) && (
                    <Error
                        errorMessage={[blogCategoriesError, blogsError]
                            .filter(Boolean)
                            .join("\n")}
                    />
                )}
            </section>

            {!blogCategoriesError && !blogsError && (
                <UserHomeContent
                    initialBlogCategories={initialBlogCategories}
                    initialBlogs={initialBlogs}
                />
            )}
        </UserLayout>
    );
};

export default User;
