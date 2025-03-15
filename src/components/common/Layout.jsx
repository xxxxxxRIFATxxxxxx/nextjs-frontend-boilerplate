import Header from "@/components/common/Header";
import Footer from "@/components/common/Footer";

const Layout = ({ children }) => {
    return (
        <>
            <Header />
            {children}
            <Footer />
        </>
    );
};

export default Layout;
