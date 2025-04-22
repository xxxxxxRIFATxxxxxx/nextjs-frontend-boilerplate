import PrivateRoute from "@/components/common/PrivateRoute";
import Error from "@/components/common/Error";
import UserLayout from "@/components/user/UserLayout";
import UserNotificationDetailsContent from "@/components/user/UserNotificationDetailsContent";
import fetchData from "@/helpers/fetchData";

export const generateMetadata = async ({ params }) => {
    const { id } = await params;

    // notification
    const notificationResponse = await fetchData(
        `${process.env.NEXT_PUBLIC_API_URL}/api/notifications/active/${id}`
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
        `${process.env.NEXT_PUBLIC_API_URL}/api/notifications/active/${id}`
    );
    const initialNotification = notificationResponse?.data || null;
    const notificationError = notificationResponse?.error || null;

    return (
        <PrivateRoute allowedRoles={["super_admin", "admin", "moderator"]}>
            <UserLayout>
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
                    <UserNotificationDetailsContent
                        initialNotification={initialNotification}
                        id={id}
                    />
                )}
            </UserLayout>
        </PrivateRoute>
    );
};

export default NotificationDetails;
