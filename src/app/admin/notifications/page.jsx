import PrivateRoute from "@/components/common/PrivateRoute";
import Error from "@/components/common/Error";
import AdminLayout from "@/components/admin/AdminLayout";
import AdminNotificationList from "@/components/admin/AdminNotificationList";
import fetchData from "@/helpers/fetchData";

export const metadata = {
    title: `Notifications - Admin | Next.js Frontend Boilerplate`,
    description: `Next JS Frontend Boilerplate`,
};

const Notifications = async () => {
    // notifications
    const notificationsResponse = await fetchData(
        `${process.env.NEXT_PUBLIC_API_URL}/api/notifications`
    );
    const initialNotifications = notificationsResponse?.data || [];
    const notificationsError = notificationsResponse?.error || null;

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
                    {(notificationsError || usersError) && (
                        <Error
                            errorMessage={[notificationsError, usersError]
                                .filter(Boolean)
                                .join("\n")}
                        />
                    )}
                </section>

                {!notificationsError && !usersError && (
                    <section>
                        <AdminNotificationList
                            initialNotifications={initialNotifications}
                            initialUsers={initialUsers}
                        />
                    </section>
                )}
            </AdminLayout>
        </PrivateRoute>
    );
};

export default Notifications;
