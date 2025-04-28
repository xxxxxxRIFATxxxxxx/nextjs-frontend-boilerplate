import Error from "@/components/common/Error";
import UserLayout from "@/components/user/UserLayout";
import UserBlogCategoryList from "@/components/user/UserBlogCategoryList";
import fetchData from "@/helpers/fetchData";

export const metadata = {
    title: `Blog categories | Next.js Frontend Boilerplate`,
    description: `Next JS Frontend Boilerplate`,
};

const BlogCategories = async () => {
    // blog categories
    const blogCategoriesResponse = await fetchData(
        `${process.env.NEXT_PUBLIC_API_URL}/api/blogCategories/active`
    );
    const initialBlogCategories = blogCategoriesResponse?.data || [];
    const blogCategoriesError = blogCategoriesResponse?.error || null;

    return (
        <UserLayout>
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
                <UserBlogCategoryList
                    initialBlogCategories={initialBlogCategories}
                />
            )}
        </UserLayout>
    );
};

export default BlogCategories;
