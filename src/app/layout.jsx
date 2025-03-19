import { Poppins } from "next/font/google";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { AuthProvider } from "@/context/AuthProvider";
import "@/styles/globals.css";

const poppins = Poppins({
    subsets: ["latin"],
    weight: ["100", "200", "300", "400", "500", "600", "700", "800", "900"],
    variable: "--font-poppins",
});

export const metadata = {
    title: "Next JS Frontend Boilerplate",
    description: "Next JS Frontend Boilerplate",
};

export default function RootLayout({ children }) {
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
                <AuthProvider>{children}</AuthProvider>
            </body>
        </html>
    );
}
