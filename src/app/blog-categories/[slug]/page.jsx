import Error from "@/components/common/Error";
import UserLayout from "@/components/user/UserLayout";
import UserBlogCategoryDetailsContent from "@/components/user/UserBlogCategoryDetailsContent";
import fetchData from "@/helpers/fetchData";

export const generateMetadata = async ({ params }) => {
    const { slug } = await params;

    const blogCategoryResponse = await fetchData(
        `${process.env.NEXT_PUBLIC_API_URL}/api/blogCategories/active/slug/${slug}`
    );

    const blogCategory = blogCategoryResponse?.data || null;
    const blogCategoryError = blogCategoryResponse?.error || null;

    if (blogCategoryError || !blogCategory) {
        return {
            title: `Blog category title | Next.js Frontend Boilerplate`,
            description: `Blog category title | Next.js Frontend Boilerplate.`,
        };
    }

    return {
        title: `${blogCategory?.title} | Next.js Frontend Boilerplate`,
        description: `${blogCategory?.title} | Next.js Frontend Boilerplate.`,
    };
};

const BlogCategoryDetails = async ({ params }) => {
    const { slug } = await params;

    const blogCategoryResponse = await fetchData(
        `${process.env.NEXT_PUBLIC_API_URL}/api/blogCategories/active/slug/${slug}`
    );

    const initialBlogCategory = blogCategoryResponse?.data || null;
    const blogCategoryError = blogCategoryResponse?.error || null;

    return (
        <UserLayout>
            {/* error message */}
            <section>
                {blogCategoryError && (
                    <Error
                        errorMessage={[blogCategoryError]
                            .filter(Boolean)
                            .join("\n")}
                    />
                )}
            </section>

            {!blogCategoryError && (
                <section>
                    <UserBlogCategoryDetailsContent
                        initialBlogCategory={initialBlogCategory}
                        slug={slug}
                    />
                </section>
            )}
        </UserLayout>
    );
};

export default BlogCategoryDetails;
