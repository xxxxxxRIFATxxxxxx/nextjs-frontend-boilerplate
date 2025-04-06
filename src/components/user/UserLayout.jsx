import UserHeader from "@/components/user/UserHeader";
import UserFooter from "@/components/user/UserFooter";

const UserLayout = ({ children }) => {
    return (
        <>
            <UserHeader />
            <main>{children}</main>
            <UserFooter />
        </>
    );
};

export default UserLayout;
