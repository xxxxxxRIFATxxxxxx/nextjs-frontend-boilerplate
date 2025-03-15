import Image from "next/image";
import Link from "next/link";
import logo from "../../../public/images/logos/logo.png";

const Logo = ({ width, height }) => {
    return (
        <Link href="/">
            <Image src={logo} alt="Logo" width={width} height={height} />
        </Link>
    );
};

export default Logo;
