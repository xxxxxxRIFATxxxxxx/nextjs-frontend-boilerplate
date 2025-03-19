import { Image } from "lucide-react";

const DefaultImage = ({ width, height, iconSize }) => {
    return (
        <div
            className={`flex items-center justify-center bg-gray-100 ${width} ${height}`}
        >
            <Image width={iconSize} height={iconSize} />
        </div>
    );
};

export default DefaultImage;
