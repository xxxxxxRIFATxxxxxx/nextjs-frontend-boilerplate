import AdminHeader from "@/components/admin/AdminHeader";
import AdminSideBar from "@/components/admin/AdminSideBar";
import AdminFooter from "@/components/admin/AdminFooter";

const AdminLayout = ({ children }) => {
    return (
        <>
            <AdminHeader />
            <main className="grid grid-cols-1 md:grid-cols-12">
                <section className="md:col-span-2">
                    <AdminSideBar />
                </section>

                <section className="md:col-span-10">{children}</section>
            </main>
            <AdminFooter />
        </>
    );
};

export default AdminLayout;
