import { Poppins } from "next/font/google";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import Maintenance from "@/components/common/Maintenance";
import { SocketProvider } from "@/context/SocketProvider";
import { AuthProvider } from "@/context/AuthProvider";
import { NotificationProvider } from "@/context/NotificationProvider";
import "@/styles/globals.css";

const poppins = Poppins({
    subsets: ["latin"],
    weight: ["100", "200", "300", "400", "500", "600", "700", "800", "900"],
    variable: "--font-poppins",
});

export const metadata = {
    title: `Next.js Frontend Boilerplate`,
    description: `Next JS Frontend Boilerplate`,
};

export default function RootLayout({ children }) {
    const isMaintenanceMode =
        process.env.NEXT_PUBLIC_MAINTENANCE_MODE === "true";

    return (
        <html lang="en">
            <head>
                {/* favicon */}
                <link rel="icon" href="/images/logos/logo.png" sizes="any" />
                <link
                    rel="icon"
                    type="image/png"
                    href="/images/logos/logo.png"
                />
                <link rel="apple-touch-icon" href="/images/logos/logo.png" />
            </head>

            <body className={`${poppins.variable}`}>
                <ToastContainer theme="colored" />

                {isMaintenanceMode ? (
                    <Maintenance />
                ) : (
                    <SocketProvider>
                        <AuthProvider>
                            <NotificationProvider>
                                {children}
                            </NotificationProvider>
                        </AuthProvider>
                    </SocketProvider>
                )}
            </body>
        </html>
    );
}
