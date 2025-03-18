import Image from "next/image";
import Link from "next/link";
import logo from "../../../public/images/logos/logo.png";

const Logo = ({ width, height }) => {
    return (
        <Link href="/">
            <Image
                src={logo}
                className=""
                width={width}
                height={height}
                alt="Logo"
            />
        </Link>
    );
};

export default Logo;
