import { Image } from "lucide-react";

const DefaultImage = ({
    width,
    height,
    iconSize,
    onClick,
    onDragOver,
    onDrop,
}) => {
    return (
        <div
            className={`flex items-center justify-center bg-gray-100 cursor-pointer ${width} ${height}`}
            onClick={onClick}
            onDragOver={onDragOver}
            onDrop={onDrop}
        >
            <Image width={iconSize} height={iconSize} />
        </div>
    );
};

export default DefaultImage;
