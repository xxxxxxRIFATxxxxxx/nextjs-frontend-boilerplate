import PrivateRoute from "@/components/common/PrivateRoute";
import Error from "@/components/common/Error";
import UserLayout from "@/components/user/UserLayout";
import UserNotificationList from "@/components/user/UserNotificationList";
import fetchData from "@/helpers/fetchData";

export const metadata = {
    title: `Notifications | Next.js Frontend Boilerplate`,
    description: `Next JS Frontend Boilerplate`,
};

const Notifications = async () => {
    const notificationsResponse = await fetchData(
        `${process.env.NEXT_PUBLIC_API_URL}/api/notifications/active`
    );

    // extract data or error messages
    const initialNotifications = notificationsResponse?.data || [];
    const notificationsError = notificationsResponse?.error || null;

    return (
        <PrivateRoute allowedRoles={["super_admin", "admin", "moderator"]}>
            <UserLayout>
                {/* error message */}
                <section>
                    {notificationsError && (
                        <Error
                            errorMessage={[notificationsError]
                                .filter(Boolean)
                                .join("\n")}
                        />
                    )}
                </section>

                {!notificationsError && (
                    <section>
                        <UserNotificationList
                            initialNotifications={initialNotifications}
                        />
                    </section>
                )}
            </UserLayout>
        </PrivateRoute>
    );
};

export default Notifications;
