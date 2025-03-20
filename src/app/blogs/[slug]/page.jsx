import Image from "next/image";
import Layout from "@/components/common/Layout";
import Error from "@/components/common/Error";
import fetchData from "@/helpers/fetchData";
import formatDateTime from "@/helpers/formatDateTime";

export async function generateMetadata({ params }) {
    const { slug } = await params;

    const blogResponse = await fetchData(
        `${process.env.NEXT_PUBLIC_API_URL}/api/blogs/slug/${slug}`
    );

    const blog = blogResponse?.data || null;
    const blogError = blogResponse?.error || null;

    if (blogError || !blog) {
        return { title: "Blog title", description: "Blog description." };
    }

    return {
        title: `${blog.title}`,
        description: blog?.description,
    };
}

const BlogDetails = async ({ params }) => {
    const { slug } = await params;

    const blogResponse = await fetchData(
        `${process.env.NEXT_PUBLIC_API_URL}/api/blogs/slug/${slug}`
    );

    const blog = blogResponse?.data || null;
    const blogError = blogResponse?.error || null;

    return (
        <Layout>
            {/* error message */}
            <section>
                {blogError && (
                    <Error
                        errorMessage={[blogError].filter(Boolean).join("\n")}
                    />
                )}
            </section>

            {!blogError && (
                <section>
                    <div>
                        <div>
                            <h2>Thumbnail</h2>

                            <Image
                                src={blog?.thumbnail}
                                className="w-auto h-auto"
                                width={500}
                                height={500}
                                alt="thumbnail"
                                priority
                            />
                        </div>

                        <div>
                            <h2>Cover Image</h2>

                            <Image
                                src={blog?.coverImage}
                                className="w-auto h-auto"
                                width={500}
                                height={500}
                                alt="cover image"
                            />
                        </div>

                        <div>
                            <h2>Title</h2>
                            <p>{blog?.title}</p>
                        </div>

                        <div>
                            <h2>Description</h2>
                            <div
                                dangerouslySetInnerHTML={{
                                    __html: blog?.description,
                                }}
                            ></div>
                        </div>

                        <div>
                            <h2>Category</h2>
                            <p>{blog?.category?.name}</p>
                        </div>

                        <div>
                            <h2>Created By</h2>
                            <p>{blog?.createdBy?.fullName}</p>
                        </div>

                        <div>
                            <h2>Created</h2>
                            <p>{formatDateTime(blog?.createdAt)}</p>
                        </div>

                        <div>
                            <h2>Updated</h2>
                            <p>{formatDateTime(blog?.updatedAt)}</p>
                        </div>
                    </div>
                </section>
            )}
        </Layout>
    );
};

export default BlogDetails;
