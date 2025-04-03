import { File } from "lucide-react";

const DefaultFile = ({
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
            <File width={iconSize} height={iconSize} />
        </div>
    );
};

export default DefaultFile;
