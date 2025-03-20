import { Image } from "lucide-react";

const DefaultImage = ({ width, height, iconSize, onClick }) => {
    return (
        <div
            className={`flex items-center justify-center bg-gray-100 ${width} ${height}`}
            onClick={onClick}
        >
            <Image width={iconSize} height={iconSize} />
        </div>
    );
};

export default DefaultImage;
