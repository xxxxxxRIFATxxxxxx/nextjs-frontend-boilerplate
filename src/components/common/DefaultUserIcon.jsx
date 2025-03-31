import { User } from "lucide-react";

const DefaultUserIcon = ({
    width,
    height,
    iconSize,
    onClick,
    onDragOver,
    onDrop,
}) => {
    return (
        <div
            className={`flex items-center justify-center bg-gray-100 rounded-full cursor-pointer ${width} ${height}`}
            onClick={onClick}
            onDragOver={onDragOver}
            onDrop={onDrop}
        >
            <User width={iconSize} height={iconSize} />
        </div>
    );
};

export default DefaultUserIcon;
