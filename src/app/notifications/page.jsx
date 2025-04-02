import Layout from "@/components/common/Layout";
import PrivateRoute from "@/components/common/PrivateRoute";
import Error from "@/components/common/Error";
import NotificationList from "@/components/notifications/NotificationList";
import fetchData from "@/helpers/fetchData";

const Notification = async () => {
    const notificationsResponse = await fetchData(
        `${process.env.NEXT_PUBLIC_API_URL}/api/notifications`
    );

    const usersResponse = await fetchData(
        `${process.env.NEXT_PUBLIC_API_URL}/api/users`
    );

    // extract initial data or error messages
    const initialNotifications = notificationsResponse?.data || [];
    const initialUsers = usersResponse?.data || [];

    const notificationsError = notificationsResponse?.error || null;
    const usersError = usersResponse?.error || null;

    return (
        <PrivateRoute allowedRoles={["super_admin", "admin", "moderator"]}>
            <Layout>
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
                        <NotificationList
                            initialNotifications={initialNotifications}
                            initialUsers={initialUsers}
                        />
                    </section>
                )}
            </Layout>
        </PrivateRoute>
    );
};

export default Notification;
