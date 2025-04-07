import PrivateRoute from "@/components/common/PrivateRoute";
import Error from "@/components/common/Error";
import AdminLayout from "@/components/admin/AdminLayout";
import AdminNotificationDetailsContent from "@/components/admin/AdminNotificationDetailsContent";
import fetchData from "@/helpers/fetchData";

export const generateMetadata = async ({ params }) => {
    const { id } = await params;

    // notification
    const notificationResponse = await fetchData(
        `${process.env.NEXT_PUBLIC_API_URL}/api/notifications/${id}`
    );
    const notification = notificationResponse?.data || null;
    const notificationError = notificationResponse?.error || null;

    if (notificationError || !notification) {
        return {
            title: `Notification message | Next.js Frontend Boilerplate`,
            description: `Notification message | Next.js Frontend Boilerplate.`,
        };
    }

    return {
        title: `${notification?.message} | Next.js Frontend Boilerplate`,
        description: `${notification?.message} | Next.js Frontend Boilerplate.`,
    };
};

const NotificationDetails = async ({ params }) => {
    const { id } = await params;

    // notification
    const notificationResponse = await fetchData(
        `${process.env.NEXT_PUBLIC_API_URL}/api/notifications/${id}`
    );
    const initialNotification = notificationResponse?.data || null;
    const notificationError = notificationResponse?.error || null;

    return (
        <PrivateRoute allowedRoles={["super_admin", "admin", "moderator"]}>
            <AdminLayout>
                {/* error message */}
                <section>
                    {notificationError && (
                        <Error
                            errorMessage={[notificationError]
                                .filter(Boolean)
                                .join("\n")}
                        />
                    )}
                </section>

                {!notificationError && (
                    <section>
                        <AdminNotificationDetailsContent
                            initialNotification={initialNotification}
                            id={id}
                        />
                    </section>
                )}
            </AdminLayout>
        </PrivateRoute>
    );
};

export default NotificationDetails;
