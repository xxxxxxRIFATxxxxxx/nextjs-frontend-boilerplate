import Header from "@/components/common/Header";
import Footer from "@/components/common/Footer";

const Layout = ({ children }) => {
    return (
        <>
            <Header />
            <main>{children}</main>
            <Footer />
        </>
    );
};

export default Layout;
