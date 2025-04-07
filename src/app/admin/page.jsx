import PrivateRoute from "@/components/common/PrivateRoute";
import Error from "@/components/common/Error";
import AdminLayout from "@/components/admin/AdminLayout";
import AdminDashboardContent from "@/components/admin/AdminDashboardContent";
import fetchData from "@/helpers/fetchData";

export const metadata = {
    title: `Home - Admin | Next.js Frontend Boilerplate`,
    description: `Next JS Frontend Boilerplate`,
};

const Admin = async () => {
    // users
    const usersResponse = await fetchData(
        `${process.env.NEXT_PUBLIC_API_URL}/api/users`
    );
    const initialUsers = usersResponse?.data || [];
    const usersError = usersResponse?.error || null;

    // blog categories
    const blogCategoriesResponse = await fetchData(
        `${process.env.NEXT_PUBLIC_API_URL}/api/blogCategories`
    );
    const initialBlogCategories = blogCategoriesResponse?.data || [];
    const blogCategoriesError = blogCategoriesResponse?.error || null;

    // blogs
    const blogsResponse = await fetchData(
        `${process.env.NEXT_PUBLIC_API_URL}/api/blogs`
    );
    const initialBlogs = blogsResponse?.data || [];
    const blogsError = blogsResponse?.error || null;

    // files
    const filesResponse = await fetchData(
        `${process.env.NEXT_PUBLIC_API_URL}/api/files`
    );
    const initialFiles = filesResponse?.data || [];
    const filesError = filesResponse?.error || null;

    // notifications
    const notificationsResponse = await fetchData(
        `${process.env.NEXT_PUBLIC_API_URL}/api/notifications`
    );
    const initialNotifications = notificationsResponse?.data || [];
    const notificationsError = notificationsResponse?.error || null;

    return (
        <PrivateRoute allowedRoles={["super_admin", "admin", "moderator"]}>
            <AdminLayout>
                {/* error message */}
                <section>
                    {(usersError ||
                        blogCategoriesError ||
                        blogsError ||
                        filesError ||
                        notificationsError) && (
                        <Error
                            errorMessage={[
                                usersError,
                                blogCategoriesError,
                                blogsError,
                                filesError,
                                notificationsError,
                            ]
                                .filter(Boolean)
                                .join("\n")}
                        />
                    )}
                </section>

                {!usersError &&
                    !blogCategoriesError &&
                    !blogsError &&
                    !filesError &&
                    !notificationsError && (
                        <section>
                            <AdminDashboardContent
                                initialUsers={initialUsers}
                                initialBlogCategories={initialBlogCategories}
                                initialBlogs={initialBlogs}
                                initialFiles={initialFiles}
                                initialNotifications={initialNotifications}
                            />
                        </section>
                    )}
            </AdminLayout>
        </PrivateRoute>
    );
};

export default Admin;
